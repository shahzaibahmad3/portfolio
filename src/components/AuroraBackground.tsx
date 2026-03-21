export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden dot-grid" aria-hidden="true">
      <div
        className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-[0.07]"
        style={{
          background: 'radial-gradient(ellipse, #6366f1 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'aurora-drift-1 18s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-[30%] -right-[200px] w-[700px] h-[700px] rounded-full opacity-[0.05]"
        style={{
          background: 'radial-gradient(ellipse, #22d3ee 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'aurora-drift-2 22s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-[60%] -left-[200px] w-[600px] h-[500px] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(ellipse, #a855f7 0%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'aurora-drift-3 15s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -bottom-[100px] left-1/3 w-[500px] h-[400px] rounded-full opacity-[0.03]"
        style={{
          background: 'radial-gradient(ellipse, #6366f1 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'aurora-drift-2 20s ease-in-out infinite',
        }}
      />
    </div>
  )
}
