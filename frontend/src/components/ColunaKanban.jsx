export function CardEsqueleto({ altura }) {
  return (
    <div className={`${altura} shrink-0 bg-black/10 rounded-xl w-full`}></div>
  )
}

export function ColunaKanban({ titulo, children }) {
  return (
    <div className="bg-white/30 rounded-2xl p-4 border border-white/50 flex flex-col gap-4 shadow-sm overflow-y-auto">
      {titulo && (
        <div className="h-8 shrink-0 bg-white/70 rounded-lg w-full flex items-center px-3 font-semibold text-gray-700 shadow-sm">
          {titulo}
        </div>
      )}
      
      {children}
    </div>
  )
}