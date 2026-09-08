import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { createLandRecord } from '../server/land-records.functions'

type LandRecord = {
  id: number
  surveyNumber: string
  village: string | null
  landExtent: string
  extentUnit: string
  ownerName: string
  cultivatorName: string
  cropGrown: string | null
  notes: string | null
  createdAt: string | Date | null
}

const unitOptions = ['acres', 'hectares', 'guntas', 'cents', 'bigha']

const emptyForm = {
  surveyNumber: '',
  village: '',
  landExtent: '',
  extentUnit: 'acres',
  ownerName: '',
  cultivatorName: '',
  cropGrown: '',
  notes: '',
}

function formatExtent(value: string, unit: string) {
  const n = Number(value)
  return `${Number.isFinite(n) ? n : value} ${unit}`
}

function formatDate(value: string | Date | null) {
  if (!value) return ''
  const d = new Date(value)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function LandRecordsPage({ initialRecords }: { initialRecords: LandRecord[] }) {
  const router = useRouter()
  const [records, setRecords] = useState(initialRecords)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [banner, setBanner] = useState<string | null>(null)

  function update<K extends keyof typeof emptyForm>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function validate() {
    const next: Record<string, string> = {}
    if (!form.surveyNumber.trim()) next.surveyNumber = 'Survey number is required.'
    if (!form.landExtent.trim()) next.landExtent = 'Land extent is required.'
    else if (!(Number(form.landExtent) > 0)) next.landExtent = 'Enter a positive number.'
    if (!form.ownerName.trim()) next.ownerName = "Owner's name is required."
    if (!form.cultivatorName.trim()) next.cultivatorName = 'Cultivator name is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setBanner(null)
    try {
      const record = await createLandRecord({
        data: {
          surveyNumber: form.surveyNumber.trim(),
          village: form.village.trim() || undefined,
          landExtent: Number(form.landExtent),
          extentUnit: form.extentUnit,
          ownerName: form.ownerName.trim(),
          cultivatorName: form.cultivatorName.trim(),
          cropGrown: form.cropGrown.trim() || undefined,
          notes: form.notes.trim() || undefined,
        },
      })
      setRecords((prev) => [record as LandRecord, ...prev])
      setForm(emptyForm)
      setBanner(`Recorded survey no. ${record.surveyNumber} for the register.`)
      router.invalidate()
    } catch {
      setBanner('Could not save this entry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--ledger-ink) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      />

      <header className="relative z-10 border-b-2 px-6 py-10 md:px-12" style={{ borderColor: 'var(--ledger-line)' }}>
        <div className="mx-auto max-w-5xl">
          <p
            className="mb-3 text-xs font-semibold tracking-[0.25em] uppercase"
            style={{ color: 'var(--ledger-rust)' }}
          >
            Software Engineer / Agriculture Land Owner
          </p>
          <h1 className="font-display text-4xl leading-tight font-semibold md:text-6xl">
            Dilip Pathikonda Survey Numbers
            <br />
            <span style={{ color: 'var(--ledger-rust)' }}>Keelapalli | JR Kothapalli | Ponnamakulapalli</span>
          </h1>
          <p className="mt-4 max-w-xl text-base md:text-lg" style={{ color: '#5c5145' }}>
            Log survey numbers, extent, and who tills each plot &mdash; a running ledger you and your
            neighbours can trust.
          </p>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-5xl gap-10 px-6 py-10 md:grid-cols-[minmax(0,380px)_1fr] md:px-12">
        <section
          className="rounded-sm border-2 p-6 shadow-[6px_6px_0_0_var(--ledger-line)] md:sticky md:top-10 md:self-start"
          style={{ borderColor: 'var(--ledger-ink)', backgroundColor: 'var(--ledger-bg-alt)' }}
        >
          <h2 className="font-display text-2xl font-semibold">New entry</h2>
          <p className="mt-1 text-sm" style={{ color: '#5c5145' }}>
            Fill in the plot details below.
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
            <Field label="Survey number" htmlFor="surveyNumber" error={errors.surveyNumber} required>
              <input
                id="surveyNumber"
                value={form.surveyNumber}
                onChange={(e) => update('surveyNumber', e.target.value)}
                placeholder="e.g. 142/2B"
                className={inputClass(!!errors.surveyNumber)}
              />
            </Field>

            <Field label="Village" htmlFor="village">
              <select
                id="village"
                value={form.village}
                onChange={(e) => update('village', e.target.value)}
                className={inputClass(false)}
              >
                <option value="">Select village</option>
                <option value="1">Keelapalli</option>
                <option value="2">Ponnamakanpalli</option>
                <option value="3">JR Kothapalli</option>
              </select>
            </Field>

            <div className="grid grid-cols-[1fr_auto] gap-3">
              <Field label="Land extent" htmlFor="landExtent" error={errors.landExtent} required>
                <input
                  id="landExtent"
                  inputMode="decimal"
                  value={form.landExtent}
                  onChange={(e) => update('landExtent', e.target.value)}
                  placeholder="e.g. 0.0000"
                  className={inputClass(!!errors.landExtent)}
                />
              </Field>
              <Field label="Unit" htmlFor="extentUnit">
                <select
                  id="extentUnit"
                  value={form.extentUnit}
                  onChange={(e) => update('extentUnit', e.target.value)}
                  className={inputClass(false)}
                >
                  {unitOptions.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Considered for Land Ceiling" htmlFor="landCeiling" error={errors.landCeiling} required>
              <div>
                <label>
                  <input
                    type="radio"
                    name="landCeiling"
                    value="No"
                    checked={form.landCeiling === 'No'}
                    onChange={(e) => update('landCeiling', e.target.value)}
                  />
                  No
                </label>
              
                <label>
                  <input
                    type="radio"
                    name="landCeiling"
                    value="Yes"
                    checked={form.landCeiling === 'Yes'}
                    onChange={(e) => update('landCeiling', e.target.value)}
                  />
                  Yes
                </label>
              </div>
            </Field>
            
            <Field label="Owner's name" htmlFor="ownerName" error={errors.ownerName} required>
              <input
                id="ownerName"
                value={form.ownerName}
                onChange={(e) => update('ownerName', e.target.value)}
                placeholder="e.g. Dilip/Sandeep"
                className={inputClass(!!errors.ownerName)}
              />
            </Field>

            <Field label="Person cultivating the land" htmlFor="cultivatorName" error={errors.cultivatorName} required>
              <input
                id="cultivatorName"
                value={form.cultivatorName}
                onChange={(e) => update('cultivatorName', e.target.value)}
                placeholder="e.g. Ramaiah Naidu (farmer)"
                className={inputClass(!!errors.cultivatorName)}
              />
            </Field>

            <Field label="Crop currently grown" htmlFor="cropGrown">
              <input
                id="cropGrown"
                value={form.cropGrown}
                onChange={(e) => update('cropGrown', e.target.value)}
                placeholder="e.g. Groundnut"
                className={inputClass(false)}
              />
            </Field>

            <Field label="Notes" htmlFor="notes">
              <textarea
                id="notes"
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                rows={3}
                placeholder="Boundary markers, irrigation source, disputes..."
                className={inputClass(false) + ' resize-none'}
              />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-sm px-5 py-3 text-sm font-semibold tracking-wide uppercase text-[var(--ledger-bg)] transition-transform disabled:opacity-60"
              style={{ backgroundColor: 'var(--ledger-rust)' }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {submitting ? 'Saving...' : 'Add to register'}
            </button>

            {banner && (
              <p
                className="text-sm"
                style={{ color: banner.startsWith('Could not') ? '#a02f2f' : 'var(--ledger-green)' }}
              >
                {banner}
              </p>
            )}
          </form>
        </section>

        <section>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold">Survey Numbers</h2>
            <span className="text-sm" style={{ color: '#5c5145' }}>
              {records.length} {records.length === 1 ? 'plot' : 'plots'}
            </span>
          </div>

          {records.length === 0 ? (
            <div
              className="rounded-sm border-2 border-dashed p-10 text-center"
              style={{ borderColor: 'var(--ledger-line)' }}
            >
              <p className="font-display text-xl">The register is empty.</p>
              <p className="mt-2 text-sm" style={{ color: '#5c5145' }}>
                Add your first plot using the form to start the ledger.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {records.map((r) => (
                <li
                  key={r.id}
                  className="rounded-sm border-2 p-5 transition-shadow"
                  style={{ borderColor: 'var(--ledger-line)', backgroundColor: 'var(--ledger-bg-alt)' }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold">
                      Survey No. {r.surveyNumber}
                      {r.village ? <span className="ml-2 text-sm font-normal opacity-70">{r.village}</span> : null}
                    </h3>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase"
                      style={{ backgroundColor: 'var(--ledger-rust)', color: 'var(--ledger-bg)' }}
                    >
                      {formatExtent(r.landExtent, r.extentUnit)}
                    </span>
                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="opacity-60">Owner</dt>
                      <dd className="font-medium">{r.ownerName}</dd>
                    </div>
                    <div>
                      <dt className="opacity-60">Cultivator</dt>
                      <dd className="font-medium">{r.cultivatorName}</dd>
                    </div>
                    {r.cropGrown && (
                      <div>
                        <dt className="opacity-60">Crop</dt>
                        <dd className="font-medium">{r.cropGrown}</dd>
                      </div>
                    )}
                  </dl>

                  {r.notes && (
                    <p className="mt-3 border-t pt-3 text-sm opacity-80" style={{ borderColor: 'var(--ledger-line)' }}>
                      {r.notes}
                    </p>
                  )}

                  <p className="mt-3 text-xs opacity-50">Added {formatDate(r.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

function inputClass(hasError: boolean) {
  return [
    'w-full rounded-sm border-2 bg-[var(--ledger-bg)] px-3 py-2 text-sm outline-none transition-colors',
    hasError ? 'border-[#a02f2f]' : 'border-[var(--ledger-line)] focus:border-[var(--ledger-rust)]',
  ].join(' ')
}

function Field({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
        {label} {required && <span style={{ color: 'var(--ledger-rust)' }}>*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs" style={{ color: '#a02f2f' }}>{error}</p>}
    </div>
  )
}
