'use client'

import { useMemo, useRef, useState } from 'react'
import { jsPDF } from 'jspdf'
import { zipSync, strToU8 } from 'fflate'
import { Download, FileImage, FileText, ImagePlus, Move, Plus, Save, Sparkles, Upload, ZoomIn, ZoomOut } from 'lucide-react'

type Recipient = { name: string }

const starterRecipients: Recipient[] = [
  { name: 'Amara Okafor' },
  { name: 'Mateo Silva' },
  { name: 'Sofia Chen' },
  { name: 'Jordan Williams' },
]

function safeName(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'recipient'
}

function certificateSvg(name: string, signature: boolean, image: string | null, position: { x: number; y: number }) {
  const escaped = name.replace(/[<&>]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[char] ?? char)
  const imageMarkup = image ? `<image href="${image}" x="${position.x - 70}" y="${position.y - 70}" width="140" height="140" preserveAspectRatio="xMidYMid slice"/>` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1414 1000"><rect width="1414" height="1000" fill="#fcfaf4"/><rect x="45" y="32" width="1324" height="936" fill="none" stroke="#c89f54"/><rect x="72" y="55" width="1270" height="890" fill="none" stroke="#dfc17f"/><text x="141" y="150" font-family="Arial" font-size="22" letter-spacing="8" fill="#a77e39">SUMMER LEARNING SERIES</text><text x="141" y="360" font-family="Georgia" font-size="80" fill="#29364b">Certificate</text><text x="141" y="430" font-family="Georgia" font-size="34" font-style="italic" fill="#a77e39">of participation</text><text x="707" y="620" text-anchor="middle" font-family="Georgia" font-size="58" font-weight="bold" fill="#25344d">${escaped}</text><text x="141" y="750" font-family="Arial" font-size="20" fill="#667184">for completing the Summer Workshop 2026</text>${imageMarkup}${signature ? '<text x="1120" y="820" text-anchor="middle" font-family="Georgia" font-size="34" font-style="italic" fill="#59657a">A. Rivera</text><text x="1120" y="850" text-anchor="middle" font-family="Arial" font-size="13" letter-spacing="3" fill="#8b94a2">PROGRAM DIRECTOR</text>' : ''}<circle cx="210" cy="835" r="42" fill="none" stroke="#d1aa61"/><text x="210" y="832" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="#b1843e">2026</text><text x="210" y="847" text-anchor="middle" font-family="Arial" font-size="8" fill="#b1843e">CERTIFIED</text></svg>`
}

function svgToPdf(svg: string) {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  const encoded = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  return new Promise<Uint8Array>((resolve, reject) => {
    pdf.addImage(encoded, 'SVG', 0, 0, 842, 595, undefined, 'FAST')
    resolve(new Uint8Array(pdf.output('arraybuffer')))
  }).catch(reject)
}

export default function Page() {
  const [recipients, setRecipients] = useState(starterRecipients)
  const [selected, setSelected] = useState(0)
  const [csvName, setCsvName] = useState('')
  const [signature, setSignature] = useState(true)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imagePosition, setImagePosition] = useState({ x: 1180, y: 690 })
  const [dragging, setDragging] = useState(false)
  const [zoom, setZoom] = useState(76)
  const [saved, setSaved] = useState(true)
  const csvInput = useRef<HTMLInputElement>(null)
  const imageInput = useRef<HTMLInputElement>(null)
  const recipient = recipients[selected] ?? { name: '' }
  const svg = useMemo(() => certificateSvg(recipient.name, signature, uploadedImage, imagePosition), [recipient.name, signature, uploadedImage, imagePosition])

  function parseCsv(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      const rows = String(reader.result ?? '').split(/\r?\n/).map((row) => row.split(',')[0].trim().replace(/^"|"$/g, '')).filter(Boolean)
      const names = rows[0]?.toLowerCase() === 'name' ? rows.slice(1) : rows
      if (names.length) { setRecipients(names.map((name) => ({ name }))); setSelected(0); setCsvName(file.name); setSaved(false) }
    }
    reader.readAsText(file)
  }

  function handleImage(file: File) {
    const reader = new FileReader()
    reader.onload = () => { setUploadedImage(String(reader.result)); setSaved(false) }
    reader.readAsDataURL(file)
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) handleImage(file)
  }

  function moveImage(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return
    const rect = event.currentTarget.getBoundingClientRect()
    setImagePosition({ x: Math.max(120, Math.min(1290, ((event.clientX - rect.left) / rect.width) * 1414)), y: Math.max(120, Math.min(880, ((event.clientY - rect.top) / rect.height) * 1000)) })
  }

  async function downloadZip() {
    const files: Record<string, Uint8Array> = {}
    for (const [index, item] of recipients.entries()) files[`certificate-${index + 1}-${safeName(item.name)}.pdf`] = await svgToPdf(certificateSvg(item.name, signature, uploadedImage, imagePosition))
    const blob = new Blob([zipSync(files, { level: 6 })], { type: 'application/zip' })
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'summer-workshop-certificates.zip'; link.click(); URL.revokeObjectURL(url)
  }

  return <main className="flex h-dvh flex-col overflow-hidden bg-[#f7f8fa] text-[#20242c]">
    <header className="flex h-[58px] shrink-0 items-center justify-between border-b bg-white px-8"><div className="flex items-center gap-2.5"><span className="flex size-9 items-center justify-center rounded-[10px] bg-[#2855d9] text-white"><Sparkles size={18} /></span><strong>certify<span className="text-[#2855d9]">.</span></strong><span className="ml-5 text-sm text-[#777f8f]">Projects / Summer Workshop</span></div><div className="flex items-center gap-2"><span className="text-xs text-[#777f8f]">{saved ? 'Saved just now' : 'Unsaved changes'}</span><button onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 2200) }} className="flex h-9 items-center gap-2 rounded-lg border px-3 text-sm"><Save size={15} />Save</button><button onClick={downloadZip} className="flex h-9 items-center gap-2 rounded-lg bg-[#2855d9] px-3.5 text-sm text-white"><Download size={15} />Export PDF ZIP</button></div></header>
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <aside className="w-[280px] shrink-0 overflow-y-auto border-r bg-white p-6"><h1 className="text-xl font-semibold">Build your certificate</h1><p className="mt-2 text-sm text-[#7d8593]">Upload recipients, add artwork, and position it directly on the certificate.</p><div className="mt-6 flex flex-col gap-3"><button onClick={() => csvInput.current?.click()} className="flex items-center gap-2 rounded-lg border p-3 text-left text-sm"><Upload size={16} />Upload names CSV<input ref={csvInput} className="hidden" type="file" accept=".csv,text/csv" onChange={(event) => event.target.files?.[0] && parseCsv(event.target.files[0])} /></button><span className="text-xs text-[#7d8593]">{csvName || `${recipients.length} recipients loaded`}</span><button onClick={() => imageInput.current?.click()} className="flex items-center gap-2 rounded-lg border p-3 text-left text-sm"><ImagePlus size={16} />Upload image<input ref={imageInput} className="hidden" type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && handleImage(event.target.files[0])} /></button><button onClick={() => setRecipients([...recipients, { name: 'New recipient' }])} className="flex items-center gap-2 rounded-lg border p-3 text-left text-sm"><Plus size={16} />Add recipient</button></div><div className="mt-6 flex flex-col gap-2">{recipients.map((item, index) => <button key={`${item.name}-${index}`} onClick={() => setSelected(index)} className={`rounded-lg p-3 text-left text-sm ${selected === index ? 'bg-[#edf2ff] text-[#2855d9]' : 'hover:bg-[#f5f7fb]'}`}>{item.name || 'Unnamed recipient'}</button>)}</div></aside>
      <section className="flex min-w-0 flex-1 flex-col p-6"><div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2 text-sm text-[#7e8694]"><FileImage size={15} />completion-certificate.pdf</div><div className="flex items-center gap-2"><button aria-label="Zoom out" onClick={() => setZoom(Math.max(40, zoom - 10))}><ZoomOut size={16} /></button><span className="w-10 text-center text-xs">{zoom}%</span><button aria-label="Zoom in" onClick={() => setZoom(Math.min(110, zoom + 10))}><ZoomIn size={16} /></button><button onClick={() => setZoom(76)} className="text-xs text-[#2855d9]">Fit</button></div></div><div onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} onPointerMove={moveImage} onPointerUp={() => setDragging(false)} className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl bg-[#eef0f3] p-5" style={{ backgroundImage: 'radial-gradient(#d9dde4 1px, transparent 1px)', backgroundSize: '16px 16px' }}><div onPointerDown={() => uploadedImage && setDragging(true)} className="relative aspect-[1.414/1] h-full max-h-full w-auto max-w-full bg-[#fcfaf4] shadow-xl" style={{ transform: `scale(${zoom / 76})`, cursor: uploadedImage ? (dragging ? 'grabbing' : 'grab') : 'default', touchAction: 'none' }} dangerouslySetInnerHTML={{ __html: svg.replace('</svg>', `<text x="${imagePosition.x}" y="${imagePosition.y + 95}" text-anchor="middle" font-family="Arial" font-size="16" fill="#7d8593">${uploadedImage ? 'Drag image to reposition' : ''}</text></svg>`) }} /> </div></section>
      <aside className="w-[286px] shrink-0 overflow-y-auto border-l bg-white p-6"><h2 className="font-semibold">Properties</h2><div className="mt-5 flex flex-col gap-4"><label className="text-sm">Recipient name<input value={recipient.name} onChange={(event) => { const next = [...recipients]; next[selected] = { name: event.target.value }; setRecipients(next); setSaved(false) }} className="mt-2 h-10 w-full rounded-lg border px-3" /></label><label className="text-sm">Certificate image<div className="mt-2 flex items-center gap-2 text-xs text-[#7d8593]"><Move size={14} />{uploadedImage ? 'Drag image on preview to reposition' : 'No image uploaded'}</div></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={signature} onChange={(event) => { setSignature(event.target.checked); setSaved(false) }} />Show signature</label><button onClick={() => setImagePosition({ x: 1180, y: 690 })} className="rounded-lg border px-3 py-2 text-sm">Reset image position</button></div></aside>
    </div>
  </main>
}
