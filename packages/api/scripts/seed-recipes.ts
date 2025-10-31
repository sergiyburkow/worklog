#!/usr/bin/env ts-node
import { PrismaClient, Prisma } from '@prisma/client'

function parseArgs(argv: string[]) {
  const args: Record<string, string[]> = {}
  let key: string | null = null
  for (const a of argv.slice(2)) {
    if (a.startsWith('--')) { key = a.replace(/^--/, ''); args[key] = args[key] || []; continue }
    if (key) { args[key].push(a) } else { (args._ = args._ || []).push(a) }
  }
  return args
}

function parsePair(s: string): { id: string; value: number } {
  const [id, val] = s.split(':')
  if (!id || !val) throw new Error(`Invalid pair '${s}', expected PART_ID:number`)
  const num = Number(val)
  if (!isFinite(num) || num <= 0) throw new Error(`Invalid number in '${s}'`)
  return { id, value: num }
}

async function main() {
  const prisma = new PrismaClient()
  try {
    const args = parseArgs(process.argv)
    const taskId = (args.task || [])[0]
    if (!taskId) throw new Error('Provide --task TASK_ID')

    const outputs = (args.output || []).map(parsePair)
    const consumptions = (args.consume || args.consumption || []).map(parsePair)

    const task = await prisma.task.findUnique({ where: { id: taskId } })
    if (!task) throw new Error(`Task ${taskId} not found`)

    const partIds = Array.from(new Set([...outputs.map(o => o.id), ...consumptions.map(c => c.id)]))
    const parts = await prisma.part.findMany({ where: { id: { in: partIds } } })
    if (parts.length !== partIds.length) throw new Error('Some parts not found')
    if (parts.some(p => p.projectId !== task.projectId)) throw new Error('All parts must belong to the task project')

    for (const o of outputs) {
      await prisma.taskOutputPart.upsert({
        where: { taskId_partId: { taskId, partId: o.id } },
        create: { taskId, partId: o.id, perUnit: new Prisma.Decimal(o.value) },
        update: { perUnit: new Prisma.Decimal(o.value) },
      })
    }
    for (const c of consumptions) {
      await prisma.taskPartConsumption.upsert({
        where: { taskId_partId: { taskId, partId: c.id } },
        create: { taskId, partId: c.id, quantityPerUnit: new Prisma.Decimal(c.value) },
        update: { quantityPerUnit: new Prisma.Decimal(c.value) },
      })
    }

    console.log('Recipe updated:', {
      taskId,
      outputs: outputs.map(o => `${o.id}:${o.value}`),
      consumptions: consumptions.map(c => `${c.id}:${c.value}`),
    })
  } finally {
    await new PrismaClient().$disconnect()
  }
}

main().catch((e) => { console.error(e); process.exit(1) })



