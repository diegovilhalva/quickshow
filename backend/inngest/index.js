import { Inngest } from "inngest";
import User from "../models/user.model.js"
export const inngest = new Inngest({ id: "quick-show-tickets" });

const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            name: [first_name, last_name].filter(Boolean).join(" "),
            email: email_addresses[0]?.email_address,
            image: image_url
        }

        const existing = await User.findById(id)
        if (!existing) {
            await User.create(userData)
        } else {
            console.log(`Usuário com ID ${id} já existe. Nenhuma ação necessária.`);

        }
    }
)

const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-with-clerk' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { id } = event.data
        if (!id) {
            throw new Error("ID do usuário ausente no evento.")
        }
        await User.findByIdAndDelete(id)
        console.log(`Usuário com ID ${id} deletado com sucesso.`)
    }
)
const syncUserUpdatation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      name: [first_name, last_name].filter(Boolean).join(" "),
      email: email_addresses[0]?.email_address,
      image: image_url,
    };

    await User.findByIdAndUpdate(id, userData, { new: true });
    console.log(`Usuário com ID ${id} atualizado com sucesso.`);
  }
);

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdatation];