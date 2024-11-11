import { db } from "@/db";
import { SendMesageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    
    const body = await req.json()

    const { getUser } = getKindeServerSession()
    const user = getUser()
  
    const userId = (await user).id;


    if(!userId) {
        return new Response('Unauthorized', { status: 401 })
    }

    const { fileId, message } = SendMesageValidator.parse(body)

    const file = await db.file.findFirst({
        where: {
            id: fileId,
            userId,
        },
    })

    if(!file) {
        return new Response('Not found', { status: 404 })
    }

    await db.message.create({
        data: {
            text: message,
            isUserMessage: true,
            userId,
            fileId,
        },
    })


}