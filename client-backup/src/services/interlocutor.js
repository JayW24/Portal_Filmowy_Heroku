export default function interlocutor(login, sender, receiver) {
    if (login == sender) {
        return receiver
    }
    else {
        return sender
    }
}