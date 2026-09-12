"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MoreVertical, Send, ShieldAlert, UserX } from "lucide-react";
import { ChatMessage, Match } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/storage";

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const savedMatches = JSON.parse(localStorage.getItem(STORAGE_KEYS.matches) || "[]") as Match[];
      setMatch(savedMatches.find((item) => item.id === params.id) || null);
      const savedMessages = JSON.parse(localStorage.getItem(STORAGE_KEYS.messages) || "[]") as ChatMessage[];
      setMessages(savedMessages.filter((item) => item.matchId === params.id));
    } catch {}
  }, [params.id]);

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim() || !match) return;
    const message: ChatMessage = { id: crypto.randomUUID(), matchId: match.id, sender: "me", text: text.trim(), sentAt: new Date().toISOString() };
    const allMessages = [...JSON.parse(localStorage.getItem(STORAGE_KEYS.messages) || "[]"), message] as ChatMessage[];
    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(allMessages));
    setMessages((current) => [...current, message]);
    setText("");
  };

  const updateNotice = (message: string) => { setNotice(message); setShowMenu(false); window.setTimeout(() => setNotice(""), 2400); };
  const report = () => updateNotice(`${match?.profile.name || "User"} was reported. Thanks for helping keep lovenorth safe.`);
  const block = () => {
    if (!match) return;
    const blocked = JSON.parse(localStorage.getItem(STORAGE_KEYS.blocked) || "[]") as string[];
    localStorage.setItem(STORAGE_KEYS.blocked, JSON.stringify([...new Set([...blocked, match.profile.id])]));
    unmatch(false);
  };
  const unmatch = (goBack = true) => {
    if (!match) return;
    const matches = JSON.parse(localStorage.getItem(STORAGE_KEYS.matches) || "[]") as Match[];
    localStorage.setItem(STORAGE_KEYS.matches, JSON.stringify(matches.filter((item) => item.id !== match.id)));
    if (goBack) router.push("/matches");
  };

  if (!match) return <main className="min-h-screen bg-[#0f0f12] flex items-center justify-center text-white/60">Match not found.</main>;

  return <main className="min-h-screen bg-[#0f0f12] max-w-lg mx-auto flex flex-col">
    <header className="h-16 px-4 flex items-center gap-3 border-b border-white/10 sticky top-0 bg-[#0f0f12]/90 backdrop-blur-md z-10"><button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center" aria-label="Back"><ArrowLeft className="w-5 h-5" /></button><img src={match.profile.photos[0]} alt={match.profile.name} className="w-10 h-10 rounded-full object-cover" /><div className="flex-1"><h1 className="font-semibold">{match.profile.name}</h1><p className="text-xs text-white/40">Matched recently</p></div><button onClick={() => setShowMenu((value) => !value)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center" aria-label="Chat options"><MoreVertical className="w-5 h-5" /></button>{showMenu && <div className="absolute top-14 right-4 w-48 rounded-2xl bg-[#29272d] border border-white/10 shadow-xl p-1"><button onClick={report} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-sm hover:bg-white/10"><ShieldAlert className="w-4 h-4 text-yellow-300" /> Report profile</button><button onClick={block} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-sm hover:bg-white/10"><UserX className="w-4 h-4 text-red-300" /> Block & unmatch</button><button onClick={() => unmatch()} className="w-full px-3 py-3 rounded-xl text-left text-sm text-red-300 hover:bg-white/10">Unmatch</button></div>}</header>
  <div className="flex-1 p-4 space-y-3 overflow-y-auto">{notice && <div className="rounded-xl bg-white/10 px-3 py-2 text-xs text-white/70">{notice}</div>}<div className="text-center text-xs text-white/35 py-4">You matched with {match.profile.name}. Say hello.</div>{messages.map((message) => <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}><div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm ${message.sender === "me" ? "bg-[#ff4458] rounded-br-md" : "bg-white/10 rounded-bl-md"}`}>{message.text}</div></div>)}</div>
    <form onSubmit={sendMessage} className="p-4 border-t border-white/10 flex gap-2"><input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message..." className="flex-1 h-12 rounded-2xl bg-white/10 border border-white/10 px-4 outline-none focus:border-[#ff4458]" /><button className="w-12 h-12 rounded-2xl bg-[#ff4458] flex items-center justify-center" aria-label="Send message"><Send className="w-5 h-5" /></button></form>
  </main>;
}
