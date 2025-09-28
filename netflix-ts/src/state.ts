export type ToggleKind = 'like'|'wish';
const mem = { like: new Set<string>(), wish: new Set<string>() };
const KEY = 'netflix-ts/session'; // 탭 종료 시 소멸(휘발성에 부합)

export const State = {
  init(){
    try{
      const raw = sessionStorage.getItem(KEY);
      if(raw){
        const o = JSON.parse(raw);
        (o.like||[]).forEach((id:string)=>mem.like.add(id));
        (o.wish||[]).forEach((id:string)=>mem.wish.add(id));
      }
    }catch{}
  },
  has(k:ToggleKind,id:string){ return mem[k].has(id); },
  toggle(k:ToggleKind,id:string){
    const s = mem[k]; s.has(id)?s.delete(id):s.add(id);
    try{ sessionStorage.setItem(KEY, JSON.stringify({like:[...mem.like],wish:[...mem.wish]})); }catch{}
    return s.has(id);
  }
};
