import express from 'express'
import prisma from '../prismaClient.js'

const router = express.Router()

//create proj
router.post('/', async (req, res) => {
  const { name, description } = req.body

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description
      }
    })
    res.json(project)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Error creating project')
  }
})

//get all projects and issues
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        issues: {
          include: {
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
        }
      }
    })

    res.json(projects)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Error fetching projects')
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        issues: {
          include: {
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
        }
      }
    })

    if (!project) {
      return res.status(404).send('Project not found')
    }

    res.json(project)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Error fetching project')
  }
})

//update project
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name, description } = req.body

  try {
    const updated = await prisma.project.update({
      where: { id: parseInt(id) },
      data: { name, description }
    })
    res.json(updated)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Error updating project')
  }
})

//delete project
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    await prisma.project.delete({
      where: { id: parseInt(id) }
    })
    res.send({ message: 'Project deleted' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Error deleting project')
  }
})

export default router