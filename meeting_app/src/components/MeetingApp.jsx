import { useState, useRef, useEffect } from "react";

const STAGES = [
  "Value Proposition",
  "Commercial Pitched",
  "Contract Raised",
  "Signed",
  "Live",
];
const BRANDS = ["G6", "OYO"];
const CLASSIFICATIONS = ["Hot", "Warm", "Cold"];
const US_CITIES = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "Charlotte",
  "Indianapolis",
  "San Francisco",
  "Seattle",
  "Denver",
  "Nashville",
  "Oklahoma City",
  "Las Vegas",
  "Portland",
  "Memphis",
  "Louisville",
  "Baltimore",
  "Milwaukee",
  "Albuquerque",
  "Tucson",
  "Fresno",
  "Sacramento",
  "Mesa",
  "Kansas City",
  "Atlanta",
  "Omaha",
  "Colorado Springs",
  "Raleigh",
  "Miami",
  "Virginia Beach",
  "Minneapolis",
];

const classColor = { Hot: "#b03a2e", Warm: "#b7770d", Cold: "#1a5276" };
const classGlow = { Hot: "#f5b7b1", Warm: "#fdebd0", Cold: "#d6eaf8" };
const stageColors = ["#7d3c98", "#1a5276", "#117a65", "#b7770d", "#196f3d"];
const STORAGE_KEY = "hotelleads_data_v2";

const defaultData = {
  leads: [
    {
      id: "L001",
      name: "Ramesh Patel",
      hotel: "Comfort Suites",
      city: "Atlanta",
      srn: 85,
      brand: "G6",
      classification: "Hot",
      leadNumber: "LD-001",
      phone: "404-555-0192",
      notes: "Very interested",
    },
    {
      id: "L002",
      name: "Sandra Kim",
      hotel: "Budget Inn Express",
      city: "Dallas",
      srn: 62,
      brand: "OYO",
      classification: "Warm",
      leadNumber: "LD-002",
      phone: "214-555-0174",
      notes: "Reviewing competitors",
    },
    {
      id: "L003",
      name: "Mike Torres",
      hotel: "The Harbor Lodge",
      city: "San Diego",
      srn: 110,
      brand: "G6",
      classification: "Cold",
      leadNumber: "LD-003",
      phone: "619-555-0188",
      notes: "Long sales cycle",
    },
  ],
  meetingsFixed: [
    {
      id: "M001",
      leadId: "L001",
      date: "2025-04-05",
      time: "10:00",
      leadNumber: "LD-001",
      hotel: "Comfort Suites",
      srn: 85,
      stage: "Commercial Pitched",
      ownerName: "Ramesh Patel",
      followUp: "Yes",
      followUpDate: "2025-04-20",
      city: "Atlanta",
      brand: "G6",
      notes: "Bring updated deck",
    },
  ],
  meetingsDone: [
    {
      id: "M000",
      leadId: null,
      date: "2025-03-10",
      time: "14:00",
      leadNumber: "LD-000",
      hotel: "Skyline Motel",
      srn: 45,
      stage: "Value Proposition",
      ownerName: "Linda Ross",
      followUp: "No",
      followUpDate: "",
      city: "Chicago",
      brand: "OYO",
      notes: "Initial pitch done",
    },
  ],
};

function genId(p) {
  return (
    p + Date.now().toString().slice(-6) + Math.random().toString(36).slice(2, 5)
  );
}

const stageIdx = (s) => STAGES.indexOf(s);

const StageBadge = ({ stage }) => {
  const i = stageIdx(stage);
  const c = stageColors[i >= 0 ? i : 0];
  return (
    <span
      style={{
        background: c + "22",
        color: c,
        border: `1px solid ${c}55`,
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 10px",
        whiteSpace: "nowrap",
        letterSpacing: 0.3,
      }}
    >
      {stage}
    </span>
  );
};
const ClassBadge = ({ cls }) => (
  <span
    style={{
      background: classGlow[cls],
      color: classColor[cls],
      border: `1px solid ${classColor[cls]}55`,
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      padding: "2px 10px",
      letterSpacing: 0.5,
    }}
  >
    {cls.toUpperCase()}
  </span>
);
const BrandBadge = ({ brand }) => (
  <span
    style={{
      background: brand === "G6" ? "#eaf3de" : "#f0eafd",
      color: brand === "G6" ? "#3b6d11" : "#5b3ba0",
      border: `1px solid ${brand === "G6" ? "#97c459" : "#b39ddb"}`,
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      padding: "2px 10px",
    }}
  >
    {brand}
  </span>
);

function FInput({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  style,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: 0.7,
        }}
      >
        {label}
        {required && <span style={{ color: "#e74c3c" }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 14,
          outline: "none",
          background: "#fff",
          color: "#1a202c",
        }}
      />
    </div>
  );
}
function FSelect({ label, value, onChange, options, required, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: 0.7,
        }}
      >
        {label}
        {required && <span style={{ color: "#e74c3c" }}> *</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 14,
          background: "#fff",
          color: "#1a202c",
          outline: "none",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
function FTextarea({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: 0.7,
        }}
      >
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 14,
          background: "#fff",
          color: "#1a202c",
          outline: "none",
          resize: "vertical",
        }}
      />
    </div>
  );
}

function MeetingCard({
  meeting,
  onMoveFixed,
  onMoveDone,
  onEdit,
  onDelete,
  showMoveFixed,
  showMoveDone,
}) {
  const accent =
    stageColors[stageIdx(meeting.stage) >= 0 ? stageIdx(meeting.stage) : 0];
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderLeft: `4px solid ${accent}`,
        borderRadius: 12,
        padding: "14px 16px",
        marginBottom: 12,
        boxShadow: "0 1px 4px #0000000a",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1a202c" }}>
            {meeting.hotel}
          </div>
          <div style={{ fontSize: 12, color: "#718096", marginTop: 2 }}>
            {meeting.ownerName} — {meeting.city} —{" "}
            <BrandBadge brand={meeting.brand} />
          </div>
        </div>
        <StageBadge stage={meeting.stage} />
      </div>
      <div
        style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}
      >
        <span style={{ fontSize: 12, color: "#4a5568" }}>
          📅 {meeting.date} {meeting.time && `at ${meeting.time}`}
        </span>
        <span style={{ fontSize: 12, color: "#4a5568" }}>
          🛏 {meeting.srn} rooms
        </span>
        {meeting.leadNumber && (
          <span style={{ fontSize: 12, color: "#4a5568" }}>
            #{meeting.leadNumber}
          </span>
        )}
        {meeting.followUp === "Yes" && (
          <span style={{ fontSize: 12, color: "#2980b9" }}>
            🔄 Follow-up: {meeting.followUpDate}
          </span>
        )}
      </div>
      {meeting.notes && (
        <div
          style={{
            fontSize: 12,
            color: "#718096",
            marginTop: 8,
            fontStyle: "italic",
          }}
        >
          {meeting.notes}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <button
          onClick={() => onEdit(meeting)}
          style={{
            fontSize: 12,
            padding: "5px 12px",
            borderRadius: 6,
            border: "1px solid #cbd5e0",
            background: "#f7fafc",
            cursor: "pointer",
            color: "#2d3748",
          }}
        >
          Edit
        </button>
        {showMoveFixed && (
          <button
            onClick={() => onMoveFixed(meeting)}
            style={{
              fontSize: 12,
              padding: "5px 12px",
              borderRadius: 6,
              border: "1px solid #3490dc",
              background: "#ebf8ff",
              cursor: "pointer",
              color: "#1a56db",
            }}
          >
            → Fix Meeting
          </button>
        )}
        {showMoveDone && (
          <button
            onClick={() => onMoveDone(meeting)}
            style={{
              fontSize: 12,
              padding: "5px 12px",
              borderRadius: 6,
              border: "1px solid #38a169",
              background: "#f0fff4",
              cursor: "pointer",
              color: "#276749",
            }}
          >
            ✓ Mark Done
          </button>
        )}
        <button
          onClick={() => onDelete(meeting.id)}
          style={{
            fontSize: 12,
            padding: "5px 12px",
            borderRadius: 6,
            border: "1px solid #fc8181",
            background: "#fff5f5",
            cursor: "pointer",
            color: "#c53030",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function LeadCard({ lead, onEdit, onDelete, onSchedule, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderLeft: `4px solid ${classColor[lead.classification]}`,
        borderRadius: 12,
        padding: "14px 16px",
        marginBottom: 12,
        cursor: "grab",
        boxShadow: "0 1px 4px #0000000a",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1a202c" }}>
          {lead.name}
        </div>
        <ClassBadge cls={lead.classification} />
      </div>
      <div style={{ fontSize: 13, color: "#718096", marginTop: 4 }}>
        {lead.hotel} — {lead.city} — <BrandBadge brand={lead.brand} />
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
        {lead.srn && (
          <span style={{ fontSize: 12, color: "#4a5568" }}>
            🛏 {lead.srn} rooms
          </span>
        )}
        {lead.leadNumber && (
          <span style={{ fontSize: 12, color: "#4a5568" }}>
            #{lead.leadNumber}
          </span>
        )}
        {lead.phone && (
          <span style={{ fontSize: 12, color: "#4a5568" }}>
            📞 {lead.phone}
          </span>
        )}
      </div>
      {lead.notes && (
        <div
          style={{
            fontSize: 12,
            color: "#718096",
            marginTop: 6,
            fontStyle: "italic",
          }}
        >
          {lead.notes}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <button
          onClick={() => onSchedule(lead)}
          style={{
            fontSize: 12,
            padding: "5px 14px",
            borderRadius: 6,
            border: "1px solid #1a56db",
            background: "#ebf8ff",
            cursor: "pointer",
            color: "#1a56db",
            fontWeight: 600,
          }}
        >
          + Schedule Meeting
        </button>
        <button
          onClick={() => onEdit(lead)}
          style={{
            fontSize: 12,
            padding: "5px 12px",
            borderRadius: 6,
            border: "1px solid #cbd5e0",
            background: "#f7fafc",
            cursor: "pointer",
            color: "#2d3748",
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(lead.id)}
          style={{
            fontSize: 12,
            padding: "5px 12px",
            borderRadius: 6,
            border: "1px solid #fc8181",
            background: "#fff5f5",
            cursor: "pointer",
            color: "#c53030",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

const emptyMeeting = {
  date: "",
  time: "",
  leadNumber: "",
  hotel: "",
  srn: "",
  stage: STAGES[0],
  ownerName: "",
  followUp: "No",
  followUpDate: "",
  city: "",
  brand: "G6",
  notes: "",
};
const emptyLead = {
  name: "",
  hotel: "",
  city: "",
  srn: "",
  brand: "G6",
  classification: "Warm",
  leadNumber: "",
  phone: "",
  notes: "",
};

function MeetingForm({ initial, onSave, onCancel, title }) {
  const [form, setForm] = useState(initial || emptyMeeting);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        padding: 20,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 16,
          color: "#1a202c",
          marginBottom: 16,
        }}
      >
        {title}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FInput
          label="Date"
          type="date"
          value={form.date}
          onChange={set("date")}
          required
        />
        <FInput
          label="Time"
          type="time"
          value={form.time}
          onChange={set("time")}
          required
        />
        <FInput
          label="Hotel Name"
          value={form.hotel}
          onChange={set("hotel")}
          required
        />
        <FInput
          label="Lead Number"
          value={form.leadNumber}
          onChange={set("leadNumber")}
          placeholder="Optional"
        />
        <FInput
          label="Owner Name"
          value={form.ownerName}
          onChange={set("ownerName")}
          required
        />
        <FInput
          label="SRN (No. of Rooms)"
          type="number"
          value={form.srn}
          onChange={set("srn")}
          required
        />
        <FSelect
          label="Stage"
          value={form.stage}
          onChange={set("stage")}
          options={STAGES}
          required
        />
        <FSelect
          label="Brand"
          value={form.brand}
          onChange={set("brand")}
          options={BRANDS}
          required
        />
        <FSelect
          label="City"
          value={form.city}
          onChange={set("city")}
          options={["", ...US_CITIES]}
          required
        />
        <FSelect
          label="Follow-Up Meeting"
          value={form.followUp}
          onChange={set("followUp")}
          options={["No", "Yes"]}
        />
        {form.followUp === "Yes" && (
          <FInput
            label="Follow-Up Date"
            type="date"
            value={form.followUpDate}
            onChange={set("followUpDate")}
          />
        )}
      </div>
      <div style={{ marginTop: 12 }}>
        <FTextarea label="Notes" value={form.notes} onChange={set("notes")} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button
          onClick={() => onSave(form)}
          style={{
            padding: "9px 24px",
            borderRadius: 8,
            border: "none",
            background: "#1a56db",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: "9px 20px",
            borderRadius: 8,
            border: "1px solid #cbd5e0",
            background: "#fff",
            color: "#4a5568",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function LeadForm({ initial, onSave, onCancel, title }) {
  const [form, setForm] = useState(initial || emptyLead);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        padding: 20,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 16,
          color: "#1a202c",
          marginBottom: 16,
        }}
      >
        {title}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FInput
          label="Owner Name"
          value={form.name}
          onChange={set("name")}
          required
        />
        <FInput
          label="Lead Number"
          value={form.leadNumber}
          onChange={set("leadNumber")}
          placeholder="Optional"
        />
        <FInput
          label="Hotel Name"
          value={form.hotel}
          onChange={set("hotel")}
          required
        />
        <FInput label="Phone" value={form.phone} onChange={set("phone")} />
        <FInput
          label="SRN (No. of Rooms)"
          type="number"
          value={form.srn}
          onChange={set("srn")}
        />
        <FSelect
          label="City"
          value={form.city}
          onChange={set("city")}
          options={["", ...US_CITIES]}
          required
        />
        <FSelect
          label="Brand"
          value={form.brand}
          onChange={set("brand")}
          options={BRANDS}
        />
        <FSelect
          label="Classification"
          value={form.classification}
          onChange={set("classification")}
          options={CLASSIFICATIONS}
          required
        />
      </div>
      <div style={{ marginTop: 12 }}>
        <FTextarea label="Notes" value={form.notes} onChange={set("notes")} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button
          onClick={() => onSave(form)}
          style={{
            padding: "9px 24px",
            borderRadius: 8,
            border: "none",
            background: "#2d6a4f",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Save Lead
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: "9px 20px",
            borderRadius: 8,
            border: "1px solid #cbd5e0",
            background: "#fff",
            color: "#4a5568",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function StatsBar({ leads, fixed, done }) {
  const stats = [
    { label: "Total Leads", value: leads.length, color: "#1a56db" },
    {
      label: "Hot Leads",
      value: leads.filter((l) => l.classification === "Hot").length,
      color: "#b03a2e",
    },
    { label: "Meetings Fixed", value: fixed.length, color: "#b7770d" },
    { label: "Meetings Done", value: done.length, color: "#2d6a4f" },
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 10,
        marginBottom: 20,
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: "12px 16px",
            borderTop: `3px solid ${s.color}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#718096",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 0.7,
            }}
          >
            {s.label}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: s.color,
              marginTop: 4,
            }}
          >
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function parseExcelLeads(wb, XLSX) {
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    defval: "",
  });
  return rows
    .map((r) => ({
      id: genId("L"),
      name: String(r["Owner Name"] || r["name"] || ""),
      hotel: String(r["Hotel Name"] || r["hotel"] || ""),
      city: String(r["City"] || r["city"] || ""),
      srn: Number(r["SRN"] || r["srn"] || 0),
      brand: BRANDS.includes(String(r["Brand"] || "").toUpperCase())
        ? String(r["Brand"] || "").toUpperCase()
        : "G6",
      classification: CLASSIFICATIONS.includes(
        String(r["Classification"] || "")
      )
        ? String(r["Classification"] || "")
        : "Warm",
      leadNumber: String(r["Lead Number"] || r["leadNumber"] || ""),
      phone: String(r["Phone"] || r["phone"] || ""),
      notes: String(r["Notes"] || r["notes"] || ""),
    }))
    .filter((r) => r.name || r.hotel);
}

function parseExcelMeetings(wb, XLSX) {
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    defval: "",
  });
  return rows
    .map((r) => ({
      id: genId("M"),
      leadId: null,
      date: String(r["Date"] || r["date"] || ""),
      time: String(r["Time"] || r["time"] || ""),
      leadNumber: String(r["Lead Number"] || r["leadNumber"] || ""),
      hotel: String(r["Hotel Name"] || r["hotel"] || ""),
      srn: Number(r["SRN"] || r["srn"] || 0),
      stage: STAGES.includes(String(r["Stage"] || ""))
        ? String(r["Stage"] || "")
        : STAGES[0],
      ownerName: String(r["Owner Name"] || r["ownerName"] || ""),
      followUp: String(r["Follow Up"] || r["followUp"] || "No"),
      followUpDate: String(r["Follow Up Date"] || r["followUpDate"] || ""),
      city: String(r["City"] || r["city"] || ""),
      brand: BRANDS.includes(String(r["Brand"] || "").toUpperCase())
        ? String(r["Brand"] || "").toUpperCase()
        : "G6",
      notes: String(r["Notes"] || r["notes"] || ""),
    }))
    .filter((r) => r.hotel || r.ownerName);
}

function exportToExcel(data, filename, XLSX) {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Sheet1");
  XLSX.writeFile(wb, filename);
}

function ImportModal({
  onClose,
  onImportLeads,
  onImportFixed,
  onImportDone,
  xlsxReady,
}) {
  const [mode, setMode] = useState("leads");
  const [mergeMode, setMergeMode] = useState("append");
  const [preview, setPreview] = useState(null);
  const [err, setErr] = useState("");
  const fileRef = useRef();

  const handleFile = (e) => {
    setErr("");
    setPreview(null);
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const XLSX = window.XLSX;
        const wb = XLSX.read(ev.target.result, { type: "array" });
        const rows =
          mode === "leads"
            ? parseExcelLeads(wb, XLSX)
            : parseExcelMeetings(wb, XLSX);
        setPreview(rows);
      } catch (ex) {
        setErr("Could not parse file: " + ex.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const doImport = () => {
    if (!preview) return;
    if (mode === "leads") onImportLeads(preview, mergeMode);
    else if (mode === "fixed") onImportFixed(preview, mergeMode);
    else onImportDone(preview, mergeMode);
    onClose();
  };

  const previewCols =
    mode === "leads"
      ? ["name", "hotel", "city", "srn", "brand", "classification"]
      : ["date", "time", "hotel", "ownerName", "srn", "stage"];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 28,
          width: "min(580px,95vw)",
          maxHeight: "88vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px #00000030",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 17, color: "#1a202c" }}>
            Import from Excel / CSV
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              fontSize: 22,
              cursor: "pointer",
              color: "#718096",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {!xlsxReady && (
          <div
            style={{
              background: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              fontSize: 13,
              color: "#856404",
            }}
          >
            Library loading — please wait a moment, then try again.
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: 0.7,
              marginBottom: 8,
            }}
          >
            Import into
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              ["leads", "🎯 Potential Leads"],
              ["fixed", "📅 Meetings Fixed"],
              ["done", "✅ Meetings Done"],
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => {
                  setMode(v);
                  setPreview(null);
                  setErr("");
                }}
                style={{
                  padding: "7px 16px",
                  borderRadius: 8,
                  border: "1px solid",
                  borderColor: mode === v ? "#1a56db" : "#e2e8f0",
                  background: mode === v ? "#ebf8ff" : "#fff",
                  color: mode === v ? "#1a56db" : "#718096",
                  fontSize: 13,
                  fontWeight: mode === v ? 700 : 400,
                  cursor: "pointer",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "#f8fafc",
            border: "2px dashed #cbd5e0",
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#4a5568",
              marginBottom: 6,
            }}
          >
            Choose your file
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#a0aec0",
              marginBottom: 14,
              lineHeight: 1.6,
            }}
          >
            {mode === "leads"
              ? "Expected columns: Owner Name · Hotel Name · City · SRN · Brand (G6/OYO) · Classification (Hot/Warm/Cold) · Lead Number · Phone · Notes"
              : "Expected columns: Date (YYYY-MM-DD) · Time (HH:MM) · Hotel Name · Owner Name · SRN · Stage · Brand · City · Lead Number · Follow Up (Yes/No) · Follow Up Date · Notes"}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.csv,.xls"
            onChange={handleFile}
            style={{ display: "none" }}
          />
          <button
            onClick={() => fileRef.current.click()}
            style={{
              padding: "9px 22px",
              borderRadius: 8,
              border: "1px solid #1a56db",
              background: "#ebf8ff",
              color: "#1a56db",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            📂 Choose File (.xlsx / .csv)
          </button>
        </div>

        {err && (
          <div
            style={{
              background: "#fff5f5",
              border: "1px solid #fc8181",
              borderRadius: 8,
              padding: 10,
              marginBottom: 14,
              fontSize: 13,
              color: "#c53030",
            }}
          >
            {err}
          </div>
        )}

        {preview && (
          <>
            <div
              style={{
                background: "#f0fff4",
                border: "1px solid #68d391",
                borderRadius: 8,
                padding: 10,
                marginBottom: 14,
                fontSize: 13,
                color: "#276749",
                fontWeight: 600,
              }}
            >
              ✓ Found {preview.length} row{preview.length !== 1 ? "s" : ""} —
              preview below
            </div>
            <div
              style={{
                overflowX: "auto",
                marginBottom: 14,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr style={{ background: "#f7fafc" }}>
                    {previewCols.map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "7px 10px",
                          textAlign: "left",
                          color: "#718096",
                          fontWeight: 600,
                          borderBottom: "1px solid #e2e8f0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 6).map((r, i) => (
                    <tr
                      key={i}
                      style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}
                    >
                      {previewCols.map((c, j) => (
                        <td
                          key={j}
                          style={{
                            padding: "6px 10px",
                            borderBottom: "1px solid #f0f4f8",
                            color: "#2d3748",
                            maxWidth: 120,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {String(r[c] || "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 6 && (
                <div
                  style={{
                    fontSize: 11,
                    color: "#a0aec0",
                    padding: "6px 10px",
                    textAlign: "center",
                  }}
                >
                  …and {preview.length - 6} more rows
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 18,
                background: "#f8fafc",
                padding: "10px 14px",
                borderRadius: 8,
              }}
            >
              <span style={{ fontSize: 13, color: "#4a5568", fontWeight: 600 }}>
                If records already exist:
              </span>
              {[
                ["append", "Add to existing"],
                ["replace", "Replace all"],
              ].map(([v, l]) => (
                <label
                  key={v}
                  style={{
                    fontSize: 13,
                    color: "#2d3748",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    value={v}
                    checked={mergeMode === v}
                    onChange={() => setMergeMode(v)}
                  />
                  {l}
                </label>
              ))}
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "9px 20px",
              borderRadius: 8,
              border: "1px solid #cbd5e0",
              background: "#fff",
              color: "#4a5568",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={doImport}
            disabled={!preview || !xlsxReady}
            style={{
              padding: "9px 24px",
              borderRadius: 8,
              border: "none",
              background: preview && xlsxReady ? "#1a56db" : "#a0aec0",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: preview && xlsxReady ? "pointer" : "not-allowed",
            }}
          >
            Import {preview ? `${preview.length} rows` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MeetingApp() {
  const [tab, setTab] = useState(0);
  const [leads, setLeads] = useState([]);
  const [meetingsFixed, setMeetingsFixed] = useState([]);
  const [meetingsDone, setMeetingsDone] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [meetingFromLead, setMeetingFromLead] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [filterCls, setFilterCls] = useState("All");
  const [filterBrand, setFilterBrand] = useState("All");
  const [filterStage, setFilterStage] = useState("All");
  const [searchQ, setSearchQ] = useState("");
  const [xlsxReady, setXlsxReady] = useState(false);
  const draggingLead = useRef(null);
  const saveTimer = useRef(null);

  useEffect(() => {
    if (window.XLSX) {
      setXlsxReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src =
      "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    s.onload = () => setXlsxReady(true);
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res && res.value) {
          const d = JSON.parse(res.value);
          setLeads(d.leads || defaultData.leads);
          setMeetingsFixed(d.meetingsFixed || defaultData.meetingsFixed);
          setMeetingsDone(d.meetingsDone || defaultData.meetingsDone);
        } else {
          setLeads(defaultData.leads);
          setMeetingsFixed(defaultData.meetingsFixed);
          setMeetingsDone(defaultData.meetingsDone);
        }
      } catch {
        setLeads(defaultData.leads);
        setMeetingsFixed(defaultData.meetingsFixed);
        setMeetingsDone(defaultData.meetingsDone);
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    setSaveStatus("saving");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await window.storage.set(
          STORAGE_KEY,
          JSON.stringify({ leads, meetingsFixed, meetingsDone })
        );
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    }, 800);
  }, [leads, meetingsFixed, meetingsDone, loaded]);

  const saveLead = (form) => {
    if (editingLead) {
      setLeads((ls) =>
        ls.map((l) =>
          l.id === editingLead.id ? { ...form, id: editingLead.id } : l
        )
      );
      setEditingLead(null);
    } else setLeads((ls) => [...ls, { ...form, id: genId("L") }]);
    setShowLeadForm(false);
  };
  const saveMeeting = (form, targetTab) => {
    const meeting = {
      ...form,
      id: genId("M"),
      leadId: meetingFromLead?.id || null,
    };
    const t = targetTab ?? tab;
    if (t === 1) {
      if (editingMeeting) {
        setMeetingsFixed((ms) =>
          ms.map((m) =>
            m.id === editingMeeting.id
              ? {
                  ...form,
                  id: editingMeeting.id,
                  leadId: editingMeeting.leadId,
                }
              : m
          )
        );
        setEditingMeeting(null);
      } else setMeetingsFixed((ms) => [...ms, meeting]);
    } else {
      if (editingMeeting) {
        setMeetingsDone((ms) =>
          ms.map((m) =>
            m.id === editingMeeting.id
              ? {
                  ...form,
                  id: editingMeeting.id,
                  leadId: editingMeeting.leadId,
                }
              : m
          )
        );
        setEditingMeeting(null);
      } else setMeetingsDone((ms) => [...ms, meeting]);
    }
    setShowMeetingForm(false);
    setMeetingFromLead(null);
  };
  const deleteLead = (id) => setLeads((ls) => ls.filter((l) => l.id !== id));
  const deleteMeeting = (id, from) => {
    if (from === "fixed")
      setMeetingsFixed((ms) => ms.filter((m) => m.id !== id));
    else setMeetingsDone((ms) => ms.filter((m) => m.id !== id));
  };
  const moveToFixed = (m) => {
    setMeetingsDone((ms) => ms.filter((x) => x.id !== m.id));
    setMeetingsFixed((ms) => [...ms, m]);
  };
  const moveToDone = (m) => {
    setMeetingsFixed((ms) => ms.filter((x) => x.id !== m.id));
    setMeetingsDone((ms) => [...ms, m]);
    setTab(2);
  };
  const scheduleMeeting = (lead) => {
    setMeetingFromLead(lead);
    setShowMeetingForm(true);
    setTab(1);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (draggingLead.current) scheduleMeeting(draggingLead.current);
    draggingLead.current = null;
  };

  const importLeads = (rows, mode) => {
    if (mode === "replace") setLeads(rows);
    else setLeads((ls) => [...ls, ...rows]);
  };
  const importFixed = (rows, mode) => {
    if (mode === "replace") setMeetingsFixed(rows);
    else setMeetingsFixed((ms) => [...ms, ...rows]);
  };
  const importDone = (rows, mode) => {
    if (mode === "replace") setMeetingsDone(rows);
    else setMeetingsDone((ms) => [...ms, ...rows]);
  };

  const doExport = () => {
    if (!window.XLSX) {
      alert("Library loading, please wait.");
      return;
    }
    const XLSX = window.XLSX;
    const strip = ({ id, leadId, ...r }) => r;
    if (tab === 0)
      exportToExcel(leads.map(strip), "HotelLeads_Leads.xlsx", XLSX);
    else if (tab === 1)
      exportToExcel(meetingsFixed.map(strip), "HotelLeads_Fixed.xlsx", XLSX);
    else exportToExcel(meetingsDone.map(strip), "HotelLeads_Done.xlsx", XLSX);
  };

  const filterLeads = leads.filter((l) => {
    if (filterCls !== "All" && l.classification !== filterCls) return false;
    if (filterBrand !== "All" && l.brand !== filterBrand) return false;
    if (
      searchQ &&
      !`${l.name} ${l.hotel} ${l.city}`
        .toLowerCase()
        .includes(searchQ.toLowerCase())
    )
      return false;
    return true;
  });
  const filterMeetings = (ms) =>
    ms.filter((m) => {
      if (filterBrand !== "All" && m.brand !== filterBrand) return false;
      if (filterStage !== "All" && m.stage !== filterStage) return false;
      if (
        searchQ &&
        !`${m.hotel} ${m.ownerName} ${m.city}`
          .toLowerCase()
          .includes(searchQ.toLowerCase())
      )
        return false;
      return true;
    });
  const grouped = {
    Hot: filterLeads.filter((l) => l.classification === "Hot"),
    Warm: filterLeads.filter((l) => l.classification === "Warm"),
    Cold: filterLeads.filter((l) => l.classification === "Cold"),
  };

  if (!loaded)
    return (
      <div
        style={{
          textAlign: "center",
          padding: 80,
          color: "#718096",
          fontSize: 15,
        }}
      >
        Loading your saved data…
      </div>
    );

  const saveColor =
    saveStatus === "saved"
      ? "#68d391"
      : saveStatus === "saving"
      ? "#f6ad55"
      : "#fc8181";
  const saveLabel =
    saveStatus === "saved"
      ? "● Auto-saved to cloud"
      : saveStatus === "saving"
      ? "● Saving…"
      : "● Save error";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        fontFamily: "'Segoe UI',system-ui,sans-serif",
      }}
    >
      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onImportLeads={importLeads}
          onImportFixed={importFixed}
          onImportDone={importDone}
          xlsxReady={xlsxReady}
        />
      )}

      <div
        style={{
          background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)",
          padding: "18px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: -0.5,
            }}
          >
            HotelLeads{" "}
            <span style={{ color: "#60a5fa", fontWeight: 400, fontSize: 14 }}>
              USA
            </span>
          </div>
          <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
            G6 | OYO — Meeting &amp; Lead Tracker
            <span style={{ marginLeft: 12, fontSize: 11, color: saveColor }}>
              {saveLabel}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => setShowImport(true)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #68d391",
              background: "transparent",
              color: "#68d391",
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            ⬆ Import Excel
          </button>
          <button
            onClick={doExport}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #fbd38d",
              background: "transparent",
              color: "#fbd38d",
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            ⬇ Export Excel
          </button>
          {tab === 0 && (
            <button
              onClick={() => {
                setEditingLead(null);
                setShowLeadForm(true);
              }}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "1px solid #60a5fa",
                background: "transparent",
                color: "#60a5fa",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              + Add Lead
            </button>
          )}
          {(tab === 1 || tab === 2) && (
            <button
              onClick={() => {
                setEditingMeeting(null);
                setMeetingFromLead(null);
                setShowMeetingForm(true);
              }}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "1px solid #60a5fa",
                background: "transparent",
                color: "#60a5fa",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              + Add Meeting
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "0 28px",
          display: "flex",
          gap: 0,
          overflowX: "auto",
        }}
      >
        {[
          ["🎯", "Potential Leads", leads.length],
          ["📅", "Meetings Fixed", meetingsFixed.length],
          ["✅", "Meetings Done", meetingsDone.length],
        ].map(([e, l, c], i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            style={{
              padding: "14px 20px",
              border: "none",
              borderBottom:
                tab === i ? "3px solid #1a56db" : "3px solid transparent",
              background: "none",
              color: tab === i ? "#1a56db" : "#718096",
              fontWeight: tab === i ? 700 : 400,
              fontSize: 14,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {e} {l}{" "}
            <span
              style={{
                marginLeft: 6,
                background: tab === i ? "#1a56db" : "#e2e8f0",
                color: tab === i ? "#fff" : "#718096",
                borderRadius: 10,
                fontSize: 11,
                padding: "1px 7px",
                fontWeight: 700,
              }}
            >
              {c}
            </span>
          </button>
        ))}
      </div>

      <div style={{ padding: "20px 28px" }}>
        <StatsBar leads={leads} fixed={meetingsFixed} done={meetingsDone} />

        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 18,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            placeholder="Search by name, hotel, city…"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: 14,
              minWidth: 200,
              flex: 1,
              color: "#1a202c",
              outline: "none",
            }}
          />
          {tab === 0 && (
            <select
              value={filterCls}
              onChange={(e) => setFilterCls(e.target.value)}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 13,
                color: "#1a202c",
                background: "#fff",
              }}
            >
              <option value="All">All Classifications</option>
              {CLASSIFICATIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
          {(tab === 1 || tab === 2) && (
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 13,
                color: "#1a202c",
                background: "#fff",
              }}
            >
              <option value="All">All Stages</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 13,
              color: "#1a202c",
              background: "#fff",
            }}
          >
            <option value="All">All Brands</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {tab === 0 && (
          <>
            {showLeadForm && (
              <LeadForm
                title={editingLead ? "Edit Lead" : "Add New Lead"}
                initial={editingLead || emptyLead}
                onSave={saveLead}
                onCancel={() => {
                  setShowLeadForm(false);
                  setEditingLead(null);
                }}
              />
            )}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              style={{
                border: `2px dashed ${dragOver ? "#1a56db" : "#cbd5e0"}`,
                borderRadius: 14,
                padding: "12px 18px",
                marginBottom: 18,
                background: dragOver ? "#ebf8ff" : "#f8fafc",
                textAlign: "center",
                fontSize: 13,
                color: dragOver ? "#1a56db" : "#a0aec0",
                transition: "all .2s",
              }}
            >
              {dragOver
                ? "Drop to schedule a meeting →"
                : "Drag a lead card here to instantly schedule a meeting"}
            </div>
            {["Hot", "Warm", "Cold"].map(
              (cls) =>
                grouped[cls].length > 0 && (
                  <div key={cls}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: classColor[cls],
                        }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: classColor[cls],
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        {cls} Leads
                      </span>
                      <span style={{ fontSize: 12, color: "#718096" }}>
                        ({grouped[cls].length})
                      </span>
                    </div>
                    {grouped[cls].map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        onDragStart={() => {
                          draggingLead.current = lead;
                        }}
                        onEdit={(l) => {
                          setEditingLead(l);
                          setShowLeadForm(true);
                        }}
                        onDelete={deleteLead}
                        onSchedule={scheduleMeeting}
                      />
                    ))}
                    <div style={{ height: 8 }} />
                  </div>
                )
            )}
            {filterLeads.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  color: "#a0aec0",
                  padding: 40,
                  fontSize: 14,
                }}
              >
                No leads found. Add a lead or import from Excel.
              </div>
            )}
          </>
        )}

        {tab === 1 && (
          <>
            {showMeetingForm && (
              <MeetingForm
                title={
                  editingMeeting
                    ? "Edit Meeting"
                    : meetingFromLead
                    ? `Schedule Meeting — ${meetingFromLead.name}`
                    : "Add New Meeting"
                }
                initial={
                  editingMeeting ||
                  (meetingFromLead
                    ? {
                        ...emptyMeeting,
                        hotel: meetingFromLead.hotel,
                        city: meetingFromLead.city,
                        ownerName: meetingFromLead.name,
                        srn: meetingFromLead.srn || "",
                        brand: meetingFromLead.brand,
                        leadNumber: meetingFromLead.leadNumber,
                      }
                    : emptyMeeting)
                }
                onSave={(form) => saveMeeting(form, 1)}
                onCancel={() => {
                  setShowMeetingForm(false);
                  setEditingMeeting(null);
                  setMeetingFromLead(null);
                }}
              />
            )}
            {filterMeetings(meetingsFixed).length === 0 && !showMeetingForm ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#a0aec0",
                  padding: 40,
                  fontSize: 14,
                }}
              >
                No meetings fixed yet. Schedule from leads or import from Excel.
              </div>
            ) : (
              filterMeetings(meetingsFixed).map((m) => (
                <MeetingCard
                  key={m.id}
                  meeting={m}
                  onEdit={(m) => {
                    setEditingMeeting(m);
                    setShowMeetingForm(true);
                  }}
                  onDelete={(id) => deleteMeeting(id, "fixed")}
                  onMoveDone={moveToDone}
                  showMoveDone
                  showMoveFixed={false}
                />
              ))
            )}
          </>
        )}

        {tab === 2 && (
          <>
            {showMeetingForm && (
              <MeetingForm
                title={
                  editingMeeting ? "Edit Meeting" : "Add Completed Meeting"
                }
                initial={editingMeeting || emptyMeeting}
                onSave={(form) => saveMeeting(form, 2)}
                onCancel={() => {
                  setShowMeetingForm(false);
                  setEditingMeeting(null);
                }}
              />
            )}
            {filterMeetings(meetingsDone).length === 0 && !showMeetingForm ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#a0aec0",
                  padding: 40,
                  fontSize: 14,
                }}
              >
                No meetings done yet.
              </div>
            ) : (
              filterMeetings(meetingsDone).map((m) => (
                <MeetingCard
                  key={m.id}
                  meeting={m}
                  onEdit={(m) => {
                    setEditingMeeting(m);
                    setShowMeetingForm(true);
                  }}
                  onDelete={(id) => deleteMeeting(id, "done")}
                  onMoveFixed={moveToFixed}
                  showMoveFixed
                  showMoveDone={false}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
