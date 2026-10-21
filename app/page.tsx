'use client'

import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileImage,
  FileText,
  GripVertical,
  ImagePlus,
  Info,
  Layers3,
  LayoutTemplate,
  Lock,
  MoreHorizontal,
  MousePointer2,
  Move,
  PenLine,
  Plus,
  RotateCcw,
  Save,
  Settings2,
  Sparkles,
  Type,
  Upload,
  WandSparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

const recipients = [
  { name: 'Amara Okafor', initials: 'AO' },
  { name: 'Mateo Silva', initials: 'MS' },
  { name: 'Sofia Chen', initials: 'SC' },
  { name: 'Jordan Williams', initials: 'JW' },
]

const steps = [
  { number: '01', label: 'Recipients', icon: FileText },
  { number: '02', label: 'Template', icon: LayoutTemplate },
  { number: '03', label: 'Design', icon: WandSparkles },
  { number: '04', label: 'Export', icon: Download },
]

export default function Page() {
  const [activeStep, setActiveStep] = useState(2)
  const [selectedRecipient, setSelectedRecipient] = useState(0)
  const [selectedLayer, setSelectedLayer] = useState<'name' | 'signature'>('name')
  const [zoom, setZoom] = useState(76)
  const [showSignature, setShowSignature] = useState(true)
  const [nameSize, setNameSize] = useState(34)
  const recipient = recipients[selectedRecipient]
  const fitLabel = useMemo(() => `${zoom}%`, [zoom])

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#20242c]">
      <header className="flex h-[72px] items-center justify-between border-b border-[#e6e8ec] bg-white px-8 max-[760px]:h-auto max-[760px]:gap-3 max-[760px]:px-4 max-[760px]:py-3">
        <div className="flex items-center gap-9">
          <a href="#" className="flex items-center gap-2.5" aria-label="Certify home">
            <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#2855d9] text-white shadow-[0_5px_12px_rgba(40,85,217,.2)]"><Sparkles size={18} /></span>
            <span className="text-[17px] font-semibold tracking-[-.03em]">certify<span className="text-[#2855d9]">.</span></span>
          </a>
          <div className="h-5 w-px bg-[#e6e8ec]" />
          <div className="flex items-center gap-2 text-[13px] text-[#777f8f]"><span>Projects</span><ChevronRight size={14} /><span className="font-medium text-[#343a45]">Summer Workshop</span></div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-[12px] text-[#9299a7] sm:block"><span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#4bb981]" />Saved just now</span>
          <button className="flex h-9 items-center gap-2 rounded-lg border border-[#dfe3e9] px-3 text-[13px] font-medium text-[#4a5160] hover:bg-[#f8f9fb]"><Save size={15} />Save project</button>
          <button onClick={() => setActiveStep(3)} className="flex h-9 items-center gap-2 rounded-lg bg-[#2855d9] px-3.5 text-[13px] font-medium text-white shadow-sm hover:bg-[#2149c0]"><Download size={15} />Export</button>
          <button className="flex size-9 items-center justify-center rounded-lg border border-[#dfe3e9] text-[#626a78] hover:bg-[#f8f9fb]" aria-label="More options"><MoreHorizontal size={17} /></button>
        </div>
      </header>

      <div className="border-b border-[#e6e8ec] bg-white px-8">
        <nav className="mx-auto flex max-w-[1500px] items-center justify-between" aria-label="Certificate workflow">
          <div className="flex items-center gap-1">
            {steps.map((step, index) => {
              const Icon = step.icon
              const current = activeStep === index
              const complete = index < activeStep
              return <button key={step.label} onClick={() => setActiveStep(index)} className={`relative flex items-center gap-2.5 px-4 py-[17px] text-[13px] transition-colors ${current ? 'font-semibold text-[#2855d9]' : complete ? 'font-medium text-[#4b5360]' : 'text-[#9aa1ae]'}`}><span className={`flex size-6 items-center justify-center rounded-full text-[10px] font-semibold ${current ? 'bg-[#eaf0ff] text-[#2855d9]' : complete ? 'bg-[#eaf7f0] text-[#379765]' : 'bg-[#f1f2f4] text-[#9299a6]'}`}>{complete ? <Check size={13} /> : <Icon size={13} />}</span>{step.label}{current && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#2855d9]" />}</button>
            })}
          </div>
          <span className="hidden text-[12px] text-[#9aa1ae] lg:block">Step {String(activeStep + 1).padStart(2, '0')} of 04</span>
        </nav>
      </div>

      <section className="mx-auto grid max-w-[1500px] grid-cols-[260px_minmax(500px,1fr)_286px] gap-0 px-8 py-7 max-[1100px]:grid-cols-[220px_minmax(420px,1fr)] max-[1100px]:px-5 max-[1100px]:[&>aside:last-child]:hidden max-[760px]:block max-[760px]:px-3 max-[760px]:py-4 max-[760px]:[&>aside:first-child]:mb-5 max-[760px]:[&>aside:first-child]:pr-0 max-[760px]:[&>div]:border-x-0 max-[760px]:[&>div]:px-0">
        <aside className="pr-7">
          <div className="mb-6"><p className="mb-1 text-[11px] font-semibold uppercase tracking-[.12em] text-[#9ba2af]">Design editor</p><h1 className="text-[21px] font-semibold tracking-[-.03em]">Build your certificate</h1><p className="mt-1.5 text-[13px] leading-5 text-[#7d8593]">Position your fields and preview the final result.</p></div>
          <div className="flex flex-col gap-2">
            <button onClick={() => setSelectedLayer('name')} className={`group flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${selectedLayer === 'name' ? 'border-[#b8c9fa] bg-[#f2f6ff] shadow-[0_2px_6px_rgba(40,85,217,.06)]' : 'border-transparent bg-white hover:border-[#e2e5eb]'}`}><GripVertical size={15} className="text-[#b8bec8]" /><span className="flex size-8 items-center justify-center rounded-lg bg-[#dfe8ff] text-[#2855d9]"><Type size={16} /></span><span className="flex-1"><span className="block text-[13px] font-semibold">Recipient name</span><span className="block text-[11px] text-[#89919e]">Name column</span></span><button className="text-[#9aa1ae]" aria-label="Lock name field"><Lock size={13} /></button></button>
            <button onClick={() => setSelectedLayer('signature')} className={`group flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${selectedLayer === 'signature' ? 'border-[#b8c9fa] bg-[#f2f6ff] shadow-[0_2px_6px_rgba(40,85,217,.06)]' : 'border-transparent bg-white hover:border-[#e2e5eb]'}`}><GripVertical size={15} className="text-[#b8bec8]" /><span className="flex size-8 items-center justify-center rounded-lg bg-[#f6e9de] text-[#aa6842]"><PenLine size={16} /></span><span className="flex-1"><span className="block text-[13px] font-semibold">Signature</span><span className="block text-[11px] text-[#89919e]">signature.png</span></span><button className="text-[#9aa1ae]" aria-label="Lock signature field"><Lock size={13} /></button></button>
          </div>
          <div className="my-6 h-px bg-[#e4e7ec]" />
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.12em] text-[#9ba2af]">Add element</p>
          <div className="flex flex-col gap-2"><button onClick={() => setSelectedLayer('name')} className="flex items-center gap-2.5 rounded-lg border border-dashed border-[#cdd3de] bg-transparent px-3 py-2.5 text-[13px] font-medium text-[#646c79] hover:border-[#2855d9] hover:text-[#2855d9]"><Plus size={15} />Add name field</button><button onClick={() => setShowSignature(true)} className="flex items-center gap-2.5 rounded-lg border border-dashed border-[#cdd3de] bg-transparent px-3 py-2.5 text-[13px] font-medium text-[#646c79] hover:border-[#2855d9] hover:text-[#2855d9]"><ImagePlus size={15} />Add image</button></div>
          <div className="mt-8 rounded-xl border border-[#e2e6ec] bg-white p-3.5"><div className="flex items-start gap-2.5"><Info size={15} className="mt-0.5 shrink-0 text-[#2855d9]" /><p className="text-[11px] leading-[1.55] text-[#707987]">Fields use relative positions, so your layout stays crisp at every size.</p></div></div>
        </aside>

        <div className="min-w-0 border-x border-[#e3e6eb] px-7">
          <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2 text-[12px] text-[#7e8694]"><FileImage size={15} /><span>completion-certificate.png</span><span className="rounded bg-[#edf0f4] px-1.5 py-0.5 text-[10px]">A4 landscape</span></div><div className="flex items-center gap-1"><button className="flex size-8 items-center justify-center rounded-md text-[#7a8290] hover:bg-white" aria-label="Undo"><RotateCcw size={15} /></button><button className="flex size-8 items-center justify-center rounded-md text-[#b5bac4]" aria-label="Redo"><RotateCcw size={15} className="-scale-x-100" /></button><div className="mx-2 h-5 w-px bg-[#e2e5ea]" /><button onClick={() => setZoom(Math.max(40, zoom - 10))} className="flex size-8 items-center justify-center rounded-md text-[#7a8290] hover:bg-white" aria-label="Zoom out"><ZoomOut size={15} /></button><span className="w-10 text-center text-[11px] font-medium text-[#646d7b]">{fitLabel}</span><button onClick={() => setZoom(Math.min(110, zoom + 10))} className="flex size-8 items-center justify-center rounded-md text-[#7a8290] hover:bg-white" aria-label="Zoom in"><ZoomIn size={15} /></button><button onClick={() => setZoom(76)} className="ml-1 rounded-md px-2 py-1 text-[11px] font-medium text-[#2855d9] hover:bg-[#edf2ff]">Fit</button></div></div>
          <div className="flex min-h-[600px] items-center justify-center rounded-xl bg-[#eef0f3] p-7" style={{ backgroundImage: 'radial-gradient(#d9dde4 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
            <div className="relative aspect-[1.414/1] w-[min(100%,780px)] overflow-hidden bg-[#fcfaf4] shadow-[0_18px_40px_rgba(33,40,55,.15)] transition-all" style={{ transform: `scale(${zoom / 76})` }}>
              <div className="absolute inset-[3.2%] border border-[#c89f54]/50" /><div className="absolute inset-[5.5%] border border-[#dfc17f]/45" />
              <div className="absolute left-[10%] top-[9%] text-[8px] font-semibold uppercase tracking-[.28em] text-[#a77e39]">SUMMER LEARNING SERIES</div><div className="absolute left-[10%] top-[19%] font-serif text-[clamp(25px,4vw,54px)] leading-none text-[#29364b]">Certificate</div><div className="absolute left-[10%] top-[31%] font-serif text-[clamp(12px,1.7vw,21px)] italic text-[#a77e39]">of participation</div>
              <div className={`absolute left-[10%] top-[48%] flex h-[17%] w-[80%] items-center justify-center rounded-sm border border-dashed transition-colors ${selectedLayer === 'name' ? 'border-[#2855d9] bg-[#eaf0ff]/20' : 'border-transparent'}`} onClick={() => setSelectedLayer('name')}><span className="font-serif text-[clamp(19px,3vw,40px)] font-bold tracking-wide text-[#25344d]">{recipient.name}</span>{selectedLayer === 'name' && <><span className="absolute -left-1 -top-1 size-2 rounded-full bg-[#2855d9]" /><span className="absolute -right-1 -top-1 size-2 rounded-full bg-[#2855d9]" /><span className="absolute -bottom-1 -left-1 size-2 rounded-full bg-[#2855d9]" /><span className="absolute -bottom-1 -right-1 size-2 rounded-full bg-[#2855d9]" /><span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-[#2855d9] px-1.5 py-0.5 text-[9px] font-medium text-white">Recipient name</span></>}</div>
              <div className="absolute left-[10%] top-[69%] text-[clamp(8px,1vw,13px)] text-[#667184]">for completing the Summer Workshop 2026</div>
              {showSignature && <button onClick={() => setSelectedLayer('signature')} className={`absolute bottom-[10%] right-[15%] w-[17%] border-b border-[#b6a077] pb-1 text-center transition-colors ${selectedLayer === 'signature' ? 'border border-dashed border-[#2855d9] bg-[#eaf0ff]/20' : ''}`}><span className="font-serif text-[clamp(14px,2vw,25px)] italic text-[#59657a]">A. Rivera</span><span className="mt-1 block text-[8px] uppercase tracking-wider text-[#8b94a2]">Program Director</span></button>}
              <div className="absolute bottom-[10%] left-[10%] size-[clamp(34px,5vw,62px)] rounded-full border border-[#d1aa61] p-1"><div className="flex size-full items-center justify-center rounded-full border border-[#d1aa61] text-[6px] font-bold uppercase tracking-wider text-[#b1843e]">2026<br />CERTIFIED</div></div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-[#9199a6]"><span className="flex items-center gap-1.5"><MousePointer2 size={13} />Click an element to edit its properties</span><span className="flex items-center gap-1.5"><Move size={13} />Drag to reposition</span></div>
        </div>

        <aside className="pl-7">
          <div className="mb-5 flex items-center justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#9ba2af]">Properties</p><h2 className="mt-1 text-[17px] font-semibold">{selectedLayer === 'name' ? 'Recipient name' : 'Signature'}</h2></div><Settings2 size={17} className="text-[#8f97a4]" /></div>
          {selectedLayer === 'name' ? <div className="flex flex-col gap-5"><div><label className="mb-2 block text-[11px] font-semibold text-[#626b79]">Data source</label><button className="flex h-9 w-full items-center justify-between rounded-lg border border-[#dfe3e8] bg-white px-3 text-[12px] text-[#444c59]"><span className="flex items-center gap-2"><Type size={14} className="text-[#2855d9]" />Full name</span><ChevronDown size={14} className="text-[#9ca3ae]" /></button></div><div><label className="mb-2 block text-[11px] font-semibold text-[#626b79]">Typography</label><button className="mb-2 flex h-9 w-full items-center justify-between rounded-lg border border-[#dfe3e8] bg-white px-3 text-[12px] text-[#444c59]"><span className="font-serif">Cormorant Garamond</span><ChevronDown size={14} className="text-[#9ca3ae]" /></button><div className="flex gap-2"><div className="flex h-9 flex-1 items-center justify-between rounded-lg border border-[#dfe3e8] bg-white px-3 text-[12px]"><span>{nameSize}px</span><ChevronDown size={13} className="text-[#9ca3ae]" /></div><button className="flex size-9 items-center justify-center rounded-lg border border-[#dfe3e8] bg-white font-serif font-bold">B</button><button className="flex size-9 items-center justify-center rounded-lg border border-[#dfe3e8] bg-white font-serif italic">I</button></div></div><div><label className="mb-2 block text-[11px] font-semibold text-[#626b79]">Text color</label><div className="flex items-center gap-2 rounded-lg border border-[#dfe3e8] bg-white p-1.5"><span className="size-6 rounded border border-[#d6d9df] bg-[#25344d]" /><span className="text-[12px] text-[#555e6d]">#25344D</span><ChevronDown size={13} className="ml-auto text-[#9ca3ae]" /></div></div><div><div className="mb-2 flex items-center justify-between"><label className="text-[11px] font-semibold text-[#626b79]">Font size</label><span className="text-[11px] text-[#8d95a2]">{nameSize}px</span></div><input aria-label="Font size" type="range" min="18" max="56" value={nameSize} onChange={(event) => setNameSize(Number(event.target.value))} className="h-1.5 w-full accent-[#2855d9]" /></div><div><label className="mb-2 block text-[11px] font-semibold text-[#626b79]">Alignment</label><div className="grid grid-cols-3 overflow-hidden rounded-lg border border-[#dfe3e8] bg-white"><button className="border-r border-[#dfe3e8] bg-[#edf2ff] py-2 text-[12px] font-medium text-[#2855d9]">Left</button><button className="border-r border-[#dfe3e8] py-2 text-[12px] text-[#707887]">Center</button><button className="py-2 text-[12px] text-[#707887]">Right</button></div></div><div className="rounded-lg bg-[#fff8eb] p-3 text-[11px] leading-[1.5] text-[#856b3a]"><span className="font-semibold">Long-name behavior:</span> shrink to fit at 24px minimum</div></div> : <div className="flex flex-col gap-5"><div className="rounded-xl border border-[#e1e5eb] bg-white p-3"><div className="flex h-24 items-center justify-center rounded-lg bg-[#faf6f1]"><span className="font-serif text-2xl italic text-[#59657a]">A. Rivera</span></div><div className="mt-3 flex items-center gap-2"><span className="flex size-6 items-center justify-center rounded bg-[#f1f3f6]"><FileImage size={13} /></span><span className="text-[11px] text-[#697281]">signature.png</span><button className="ml-auto text-[11px] font-medium text-[#2855d9]">Replace</button></div></div><div><label className="mb-2 block text-[11px] font-semibold text-[#626b79]">Opacity</label><input aria-label="Signature opacity" type="range" defaultValue="92" className="h-1.5 w-full accent-[#2855d9]" /></div><div className="flex items-center justify-between rounded-lg border border-[#e1e5eb] bg-white px-3 py-2.5"><span className="text-[12px] text-[#555e6d]">Maintain aspect ratio</span><span className="size-4 rounded-full bg-[#2855d9] ring-4 ring-[#e5ecff]" /></div><button onClick={() => setShowSignature(false)} className="text-left text-[12px] font-medium text-[#ad5f4c] hover:underline">Remove signature</button></div>}
          <div className="mt-8 border-t border-[#e4e7ec] pt-5"><p className="mb-3 text-[11px] font-semibold uppercase tracking-[.12em] text-[#9ba2af]">Preview recipient</p><div className="flex items-center gap-3 rounded-xl border border-[#e1e5eb] bg-white p-3"><span className="flex size-8 items-center justify-center rounded-full bg-[#e8edff] text-[10px] font-semibold text-[#2855d9]">{recipient.initials}</span><div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold">{recipient.name}</p><p className="text-[10px] text-[#89919e]">{selectedRecipient + 1} of {recipients.length} recipients</p></div><div className="flex gap-1"><button onClick={() => setSelectedRecipient(Math.max(0, selectedRecipient - 1))} className="flex size-6 items-center justify-center rounded border border-[#e0e4e9] text-[#7a8290] disabled:opacity-40" disabled={selectedRecipient === 0} aria-label="Previous recipient"><ChevronLeft size={13} /></button><button onClick={() => setSelectedRecipient(Math.min(recipients.length - 1, selectedRecipient + 1))} className="flex size-6 items-center justify-center rounded border border-[#e0e4e9] text-[#7a8290] disabled:opacity-40" disabled={selectedRecipient === recipients.length - 1} aria-label="Next recipient"><ChevronRight size={13} /></button></div></div><button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#dfe3e8] bg-white py-2 text-[12px] font-medium text-[#545d6b] hover:bg-[#f8f9fb]"><LayoutTemplate size={14} />Preview longest name</button></div>
        </aside>
      </section>
      <footer className="flex items-center justify-between border-t border-[#e3e6eb] bg-white px-8 py-4"><button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} className="flex items-center gap-2 text-[13px] font-medium text-[#6c7481] hover:text-[#2855d9]"><ArrowLeft size={15} />Back</button><div className="flex items-center gap-2 text-[12px] text-[#8d95a2]"><span className="size-1.5 rounded-full bg-[#4bb981]" />All changes saved locally</div><button onClick={() => setActiveStep(Math.min(3, activeStep + 1))} className="flex items-center gap-2 rounded-lg bg-[#2855d9] px-4 py-2.5 text-[13px] font-medium text-white shadow-sm hover:bg-[#2149c0]">Continue to preview<ArrowRight size={15} /></button></footer>
    </main>
  )
}
