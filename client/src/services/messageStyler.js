export default function messageStyler (login, sender) {
    if (login === sender) {
        // logged user style
        return { bgColors: "bg-primary text-white", side: "justify-content-start", secondary: "text-white" }
    }
    else {
        // interlocutor style
        return { bgColors: "bg-light", side: "justify-content-end", secondary: "text-secondary" }
    }
}