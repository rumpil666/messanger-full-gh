import { Chat } from "@/components/Chat/Chat"

export default function ChatPage({ params }: { params: { id: string } }) {
    return <Chat id={params.id}/>
}