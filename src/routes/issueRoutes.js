import express from 'express'
import prisma from '../prismaClient.js'

const router = express.Router()

// Create a new issue
router.post('/', async (req, res) => {
  const {
    title,
    description,
    status,
    priority,
    projectId,
    assignedToId 
  } = req.body

  try {
    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        status,
        priority,
        project: {
          connect: { id: projectId }
        },
        createdBy: {
          connect: { id: req.userId } 
        },
        assignedTo: assignedToId ? {
          connect: { id: assignedToId }
        } : undefined
      }
    })

    res.status(201).json(issue)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Error creating issue')
  }
})

//show all issues assigned to and created by user
router.get('/', async (req, res) => {
  try {
    const issues = await prisma.issue.findMany({
      where: {
        OR: [
          { createdById: req.userId },
          { assignedToId: req.userId }
        ]
      },
      include: {
        project: true,
        createdBy: {
          select: {
            id: true,
            username: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })

    res.json(issues)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Error fetching issues')
  }
})

//get a specific issue
router.get('/:id', async (req, res) => {
  try {
    const issue = await prisma.issue.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        project: true,
        createdBy: { select: { id: true, username: true } },
        assignedTo: { select: { id: true, username: true } }
      }
    })

    if (!issue) return res.status(404).json({ message: 'Issue not found' })
    res.json(issue)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

//edit an issue
router.put('/:id', async (req, res) => {
  const { title, description, status, assignedToId } = req.body

  try {
    const updated = await prisma.issue.update({
      where: { id: Number(req.params.id) },
      data: { title, description, status, assignedToId }
    })

    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error updating issue' })
  }
})

//delete an issue
router.delete('/:id', async (req, res) => {
  try {
    await prisma.issue.delete({
      where: { id: Number(req.params.id) }
    })
    res.json({ message: 'Issue deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error deleting issue' })
  }
})

export default router