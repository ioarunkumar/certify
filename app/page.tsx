'use client'

import { useMemo, useRef, useState } from 'react'
import { jsPDF } from 'jspdf'
import { PDFDocument } from 'pdf-lib'
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import { zipSync } from 'fflate'
import { Download, FileImage, FileText, ImagePlus, Move, Plus, Save, Sparkles, Upload, ZoomIn, ZoomOut } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString()

type Recipient = { name: string }
type NameFont = 'Cinzel' | 'Great Vibes' | 'Georgia' | 'Arial'

const starterRecipients: Recipient[] = [
  { name: 'Amara Okafor' },
  { name: 'Mateo Silva' },
  { name: 'Sofia Chen' },
  { name: 'Jordan Williams' },
]

function safeName(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'recipient'
}

function getNameFontWeight(isBold: boolean) {
  return isBold ? 700 : 400
}

function certificateSvg(name: string, signature: boolean, image: string | null, position: { x: number; y: number }, templateImage: string | null = null, namePosition = { x: 707, y: 620 }, nameFont: NameFont = 'Cinzel', nameSize = 58, isBold = true) {
  const escaped = name.replace(/[<&>]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[char] ?? char)
  const fontWeight = getNameFontWeight(isBold)
  const imageMarkup = image ? `<image data-draggable="image" href="${image}" x="${position.x - 70}" y="${position.y - 70}" width="140" height="140" preserveAspectRatio="xMidYMid slice" style="cursor:move"/>` : ''
  const background = templateImage
    ? `<image href="${templateImage}" x="0" y="0" width="1414" height="1000" preserveAspectRatio="none"/>`
    : '<rect width="1414" height="1000" fill="#fcfaf4"/><rect x="45" y="32" width="1324" height="936" fill="none" stroke="#c89f54"/><rect x="72" y="55" width="1270" height="890" fill="none" stroke="#dfc17f"/><text x="141" y="150" font-family="Arial" font-size="22" letter-spacing="8" fill="#a77e39">SUMMER LEARNING SERIES</text><text x="141" y="360" font-family="Georgia" font-size="80" fill="#29364b">Certificate</text><text x="141" y="430" font-family="Georgia" font-size="34" font-style="italic" fill="#a77e39">of participation</text><text x="141" y="750" font-family="Arial" font-size="20" fill="#667184">for completing the Summer Workshop 2026</text><circle cx="210" cy="835" r="42" fill="none" stroke="#d1aa61"/><text x="210" y="832" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="#b1843e">2026</text><text x="210" y="847" text-anchor="middle" font-family="Arial" font-size="8" fill="#b1843e">CERTIFIED</text>'
  const nameMarkup = name ? `<text data-draggable="name" x="${namePosition.x}" y="${namePosition.y}" text-anchor="middle" font-family="${nameFont}" font-size="${nameSize}" font-weight="${fontWeight}" fill="#25344d" style="cursor:move">${escaped}</text>` : ''
  const signatureMarkup = signature && !templateImage
    ? '<text x="1120" y="820" text-anchor="middle" font-family="Georgia" font-size="34" font-style="italic" fill="#59657a">A. Rivera</text><text x="1120" y="850" text-anchor="middle" font-family="Arial" font-size="13" letter-spacing="3" fill="#8b94a2">PROGRAM DIRECTOR</text>'
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1414 1000" width="100%" height="100%">${background}${nameMarkup}${imageMarkup}${signatureMarkup}</svg>`
}

async function svgToPdf(svg: string, name: string, namePosition: { x: number; y: number }, nameFont: NameFont, nameSize: number, isBold: boolean) {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  const fontWeight = getNameFontWeight(isBold)
  await document.fonts.load(`${fontWeight} ${nameSize}px "${nameFont}"`)
  const encoded = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  const image = new Image()
  image.src = encoded
  await image.decode()
  const canvas = window.document.createElement('canvas')
  canvas.width = 1414
  canvas.height = 1000
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Unable to render certificate preview')
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  context.font = `${fontWeight} ${nameSize}px "${nameFont}"`
  context.textAlign = 'center'
  context.textBaseline = 'alphabetic'
  context.fillStyle = '#25344d'
  context.fillText(name, namePosition.x, namePosition.y)
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 842, 595, undefined, 'FAST')
  return new Uint8Array(pdf.output('arraybuffer'))
}

async function certificatePdf(template: ArrayBuffer | null, name: string, signature: boolean, namePosition: { x: number; y: number }, nameFont: NameFont, nameSize: number, isBold: boolean) {
  if (!template) return svgToPdf(certificateSvg('', signature, null, { x: 1180, y: 690 }, null, namePosition, nameFont, nameSize, isBold), name, namePosition, nameFont, nameSize, isBold)
  const pdf = await PDFDocument.load(template.slice(0))
  const page = pdf.getPages()[0]
  const fontWeight = getNameFontWeight(isBold)
  await document.fonts.load(`${fontWeight} ${nameSize}px "${nameFont}"`)
  const canvas = window.document.createElement('canvas')
  canvas.width = 1414
  canvas.height = 1000
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Unable to render certificate name')
  context.font = `${fontWeight} ${nameSize}px "${nameFont}"`
  context.textAlign = 'center'
  context.textBaseline = 'alphabetic'
  context.fillStyle = '#25344d'
  context.fillText(name, namePosition.x, namePosition.y)
  const nameImage = await pdf.embedPng(canvas.toDataURL('image/png'))
  page.drawImage(nameImage, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() })
  return pdf.save()
}

export default function Page() {
  const [recipients, setRecipients] = useState(starterRecipients)
  const [selected, setSelected] = useState(0)
  const [csvName, setCsvName] = useState('')
  const [signature, setSignature] = useState(true)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [certificateTemplate, setCertificateTemplate] = useState<ArrayBuffer | null>(null)
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null)
  const [certificateName, setCertificateName] = useState('')
  const [imagePosition, setImagePosition] = useState({ x: 1180, y: 690 })
  const [namePosition, setNamePosition] = useState({ x: 707, y: 620 })
  const [nameFont, setNameFont] = useState<NameFont>('Cinzel')
  const [nameSize, setNameSize] = useState(58)
  const [isBold, setIsBold] = useState(true)
  const [activeDrag, setActiveDrag] = useState<'name' | 'image' | null>(null)
  const [zoom, setZoom] = useState(76)
  const [saved, setSaved] = useState(true)
  const csvInput = useRef<HTMLInputElement>(null)
  const imageInput = useRef<HTMLInputElement>(null)
  const recipient = recipients[selected] ?? { name: '' }
  const svg = useMemo(() => certificateSvg(recipient.name, signature, uploadedImage, imagePosition, certificatePreview, namePosition, nameFont, nameSize, isBold), [recipient.name, signature, uploadedImage, imagePosition, certificatePreview, namePosition, nameFont, nameSize, isBold])

  function parseCsv(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      const rows = String(reader.result ?? '').split(/\r?\n/).map((row) => row.split(',')[0].trim().replace(/^"|"$/g, '').replace(/\s+/g, ' ')).filter(Boolean)
      const names = rows[0]?.toLowerCase() === 'name' ? rows.slice(1) : rows
      const uniqueNames = [...new Map(names.map((name) => [name.toLowerCase(), name])).values()]
      if (uniqueNames.length) { setRecipients(uniqueNames.map((name) => ({ name }))); setSelected(0); setCsvName(file.name); setSaved(false) }
    }
    reader.readAsText(file)
  }

  async function handleCertificate(file: File) {
    if (file.type !== 'application/pdf') return
    const template = await file.arrayBuffer()
    const document = await pdfjs.getDocument({ data: new Uint8Array(template.slice(0)) }).promise
    const page = await document.getPage(1)
    const viewport = page.getViewport({ scale: 1.5 })
    const canvas = window.document.createElement('canvas')
    canvas.width = Math.ceil(viewport.width)
    canvas.height = Math.ceil(viewport.height)
    const context = canvas.getContext('2d')
    if (!context) return
    await page.render({ canvas, canvasContext: context, viewport }).promise
    setCertificateTemplate(template)
    setCertificatePreview(canvas.toDataURL('image/png'))
    setCertificateName(file.name)
    setNamePosition({ x: 707, y: 620 })
    setSaved(false)
  }

  function handleImage(file: File) {
    const reader = new FileReader()
    reader.onload = () => { setUploadedImage(String(reader.result)); setSaved(false) }
    reader.readAsDataURL(file)
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setActiveDrag(null)
    const file = event.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) handleImage(file)
  }

  function startPreviewDrag(event: React.PointerEvent<HTMLDivElement>) {
    const dragTarget = (event.target as Element).closest('[data-draggable]')?.getAttribute('data-draggable')
    if (dragTarget !== 'name' && dragTarget !== 'image') return
    if (dragTarget === 'image' && !uploadedImage) return
    setActiveDrag(dragTarget)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function movePreviewItem(event: React.PointerEvent<HTMLDivElement>) {
    if (!activeDrag) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.max(80, Math.min(1334, ((event.clientX - rect.left) / rect.width) * 1414))
    const y = Math.max(100, Math.min(940, ((event.clientY - rect.top) / rect.height) * 1000))
    if (activeDrag === 'name') setNamePosition({ x, y })
    else setImagePosition({ x: Math.max(120, Math.min(1290, x)), y: Math.max(120, Math.min(880, y)) })
    setSaved(false)
  }

  async function downloadZip() {
    const files: Record<string, Uint8Array> = {}
    for (const [index, item] of recipients.entries()) files[`certificate-${index + 1}-${safeName(item.name)}.pdf`] = await certificatePdf(certificateTemplate, item.name, signature, namePosition, nameFont, nameSize, isBold)
    const blob = new Blob([zipSync(files, { level: 6 })], { type: 'application/zip' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'summer-workshop-certificates.zip'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return <main className="flex h-dvh flex-col overflow-hidden bg-[#f7f8fa] text-[#20242c]">
    <header className="flex h-[58px] shrink-0 items-center justify-between border-b bg-white px-8"><div className="flex items-center gap-2.5"><span className="flex size-9 items-center justify-center rounded-[10px] bg-[#2855d9] text-white"><Sparkles size={18} /></span><strong>certify<span className="text-[#2855d9]">.</span></strong><span className="ml-5 text-sm text-[#777f8f]">Projects / Summer Workshop</span></div><div className="flex items-center gap-2"><span className="text-xs text-[#777f8f]">{saved ? 'Saved just now' : 'Unsaved changes'}</span><button onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 2200) }} className="flex h-9 items-center gap-2 rounded-lg border px-3 text-sm"><Save size={15} />Save</button><button onClick={downloadZip} className="flex h-9 items-center gap-2 rounded-lg bg-[#2855d9] px-3.5 text-sm text-white"><Download size={15} />Export PDF ZIP</button></div></header>
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <aside className="w-[280px] shrink-0 overflow-y-auto border-r bg-white p-6"><h1 className="text-xl font-semibold">Build your certificate</h1><p className="mt-2 text-sm text-[#7d8593]">Upload recipients, add artwork, and position it directly on the certificate.</p><div className="mt-6 flex flex-col gap-3"><button onClick={() => document.getElementById('certificate-pdf-input')?.click()} className="flex items-center gap-2 rounded-lg border p-3 text-left text-sm"><FileText size={16} />Upload certificate PDF<input id="certificate-pdf-input" className="hidden" type="file" accept="application/pdf,.pdf" onChange={(event) => event.target.files?.[0] && handleCertificate(event.target.files[0])} /></button><span className="text-xs text-[#7d8593]">{certificateName || 'No PDF template loaded'}</span><button onClick={() => csvInput.current?.click()} className="flex items-center gap-2 rounded-lg border p-3 text-left text-sm"><Upload size={16} />Upload names CSV<input ref={csvInput} className="hidden" type="file" accept=".csv,text/csv" onChange={(event) => event.target.files?.[0] && parseCsv(event.target.files[0])} /></button><span className="text-xs text-[#7d8593]">{csvName || `${recipients.length} recipients loaded`}</span><button onClick={() => imageInput.current?.click()} className="flex items-center gap-2 rounded-lg border p-3 text-left text-sm"><ImagePlus size={16} />Upload image<input ref={imageInput} className="hidden" type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && handleImage(event.target.files[0])} /></button><button onClick={() => setRecipients([...recipients, { name: 'New recipient' }])} className="flex items-center gap-2 rounded-lg border p-3 text-left text-sm"><Plus size={16} />Add recipient</button></div><div className="mt-6 flex flex-col gap-2">{recipients.map((item, index) => <button key={`${item.name}-${index}`} onClick={() => setSelected(index)} className={`rounded-lg p-3 text-left text-sm ${selected === index ? 'bg-[#edf2ff] text-[#2855d9]' : 'hover:bg-[#f5f7fb]'}`}>{item.name || 'Unnamed recipient'}</button>)}</div></aside>
      <section className="flex min-w-0 flex-1 flex-col p-6"><div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2 text-sm text-[#7e8694]"><FileImage size={15} />{certificateName || 'completion-certificate.pdf'}</div><div className="flex items-center gap-2"><button aria-label="Zoom out" onClick={() => setZoom(Math.max(40, zoom - 10))}><ZoomOut size={16} /></button><span className="w-10 text-center text-xs">{zoom}%</span><button aria-label="Zoom in" onClick={() => setZoom(Math.min(110, zoom + 10))}><ZoomIn size={16} /></button><button onClick={() => setZoom(76)} className="text-xs text-[#2855d9]">Fit</button></div></div><div onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl bg-[#eef0f3] p-5" style={{ backgroundImage: 'radial-gradient(#d9dde4 1px, transparent 1px)', backgroundSize: '16px 16px' }}><div onPointerDown={startPreviewDrag} onPointerMove={movePreviewItem} onPointerUp={() => setActiveDrag(null)} className="relative aspect-[1.414/1] h-full max-h-full w-auto max-w-full bg-[#fcfaf4] shadow-xl" style={{ transform: `scale(${zoom / 76})`, cursor: activeDrag ? 'grabbing' : 'default', touchAction: 'none' }} dangerouslySetInnerHTML={{ __html: svg.replace('</svg>', `<text x="${imagePosition.x}" y="${imagePosition.y + 95}" text-anchor="middle" font-family="Arial" font-size="16" fill="#7d8593">${uploadedImage ? 'Drag image to reposition' : ''}</text></svg>`) }} /> </div></section>
      <aside className="w-[286px] shrink-0 overflow-y-auto border-l bg-white p-6">
        <h2 className="font-semibold">Properties</h2>
        <div className="mt-5 flex flex-col gap-4">
          <label className="text-sm">Recipient name<input value={recipient.name} onChange={(event) => { const next = [...recipients]; next[selected] = { name: event.target.value }; setRecipients(next); setSaved(false) }} className="mt-2 h-10 w-full rounded-lg border px-3" /></label>
          <div className="flex flex-col gap-3 border-t pt-4">
            <h3 className="text-sm font-semibold">Edit In</h3>
            <label htmlFor="name-font" className="text-sm">Font<select id="name-font" value={nameFont} onChange={(event) => { setNameFont(event.target.value as NameFont); setSaved(false) }} className="mt-2 h-10 w-full rounded-lg border bg-white px-3"><option value="Cinzel">Cinzel (closest match)</option><option value="Great Vibes">Great Vibes</option><option value="Georgia">Georgia</option><option value="Arial">Arial</option></select></label>
            <label htmlFor="name-size" className="text-sm">Size<input id="name-size" type="number" min={12} max={120} step={1} value={nameSize} onChange={(event) => { setNameSize(Math.min(120, Math.max(12, Number(event.target.value) || 12))); setSaved(false) }} className="mt-2 h-10 w-full rounded-lg border px-3" /></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isBold} onChange={(event) => { setIsBold(event.target.checked); setSaved(false) }} />Bold</label>
          </div>
          {uploadedImage && <label className="text-sm">Certificate image<div className="mt-2 flex items-center gap-2 text-xs text-[#7d8593]"><Move size={14} />Drag image on preview to reposition</div></label>}
          {!certificateTemplate && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={signature} onChange={(event) => { setSignature(event.target.checked); setSaved(false) }} />Show signature</label>}
          {uploadedImage && <button onClick={() => { setImagePosition({ x: 1180, y: 690 }); setSaved(false) }} className="rounded-lg border px-3 py-2 text-sm">Reset image position</button>}
        </div>
      </aside>
    </div>
  </main>
}
