import { UpdateChat } from "@/components/UpdateChat/UpdateChat"

export default function UpdateChatPage({ params }: { params: { id: string } }) {

  return (
    <UpdateChat id={params.id}/>
  )
}
