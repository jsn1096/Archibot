import { NextRequest } from "next/server";
import OpenAI from "openai";
import { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";

const assistantId = "asst_dvCdbRLpNFy2oJk0ymR27SE0"
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function waitForResult(threadId: string, runId: string):Promise<void> {
  return new Promise<void>((resolve, reject) => {
    async function verifyStatus() {      
      try {
        const currentRun = await openai.beta.threads.runs.retrieve(threadId, runId)
        if (currentRun.status === "completed") {
          resolve()
        } else {
          setTimeout( verifyStatus, 1000)
        }
      } catch(e) {
        reject(e)
      }
    }
    verifyStatus()
  })
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const textToSearch = params.get("search")
  let result = ""

  if (textToSearch === null) {
    return Response.json({data: result})
  }
  // recibir el asistente
  try {
    const archiAssistant = await openai.beta.assistants.retrieve(assistantId)
    const emptyThread = await openai.beta.threads.create()
    await openai.beta.threads.messages.create(emptyThread.id, {
      role: "user",
      content: textToSearch
    })
    const run = await openai.beta.threads.runs.create(emptyThread.id, {
      assistant_id: archiAssistant.id
    })
    await waitForResult(emptyThread.id, run.id)

    const messages = await openai.beta.threads.messages.list(emptyThread.id)
      messages.data.forEach(m => {
        if (m.role === "assistant") {
          const content: TextContentBlock[] = m.content as TextContentBlock[]
          result = content[0].text.value
        } else {
        }
      })

  } catch(e) {
    console.error("No se pudo obtener el asistente", e)
  }

  return Response.json({data: result})
}