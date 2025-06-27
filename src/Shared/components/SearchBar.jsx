import React, { useState, useEffect, useRef } from "react";
import { Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import levenshtein from "fast-levenshtein";

export default function SearchBar() {
  const [value, setValue] = useState(null);   /* selected file */
  const [options, setOptions] = useState([]); /* dropdown items */
  const [allIds, setAllIds] = useState([]);   /* lower-case IDs */
  const navigate = useNavigate();

  const triggeredTerm = useRef(null);         /* remembers last 4-char toast */

  /* load pdb list once */
  useEffect(() => {
    fetch("/filtered_pdbs_list.json")
      .then(r => r.json())
      .then(files => {
        const ids = files.map(f => f.replace(".pdb", "").toLowerCase());
        setAllIds(ids);
        setOptions(
          ids.map(id => ({ value: id + ".pdb", label: id.toUpperCase() }))
        );
      });
  }, []);

  /* helper: get 5 nearest ids */
  const nearest5 = term =>
    allIds
      .map(id => ({ id, d: levenshtein.get(term, id) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 5)
      .map(x => x.id);

  /* show toast only when term.length === 4 */
  const handleSearch = text => {
    const term = text.trim().toLowerCase();

    if (term.length !== 4) {
      triggeredTerm.current = null;           // reset when length ≠ 4
      return;
    }
    if (term === triggeredTerm.current) return; // already suggested once

    triggeredTerm.current = term;

    if (allIds.includes(term)) return;         // exact match exists

    const list = nearest5(term);
    const key  = `suggest-${Date.now()}`;

    message.info({
      key,
      duration: 6,
      onClose: () => (triggeredTerm.current = null),
      content: (
        <>
          <p style={{ marginBottom: 6 }}>No exact match. Did you mean:</p>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {list.map(id => (
              <li key={id}>
                <a
                  onClick={() => {
                    message.destroy(key);
                    navigate(`/similarity/${id}`);
                  }}
                >
                  {id.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>
        </>
      ),
    });
  };

  /* when user picks an exact filename */
  const handleSelect = file => {
    const id = file.replace(".pdb", "").toLowerCase();
    setValue(file);
    navigate(`/similarity/${id}`);
    triggeredTerm.current = null;
  };

  return (
    <Select
      showSearch
      value={value}
      placeholder="Search PDBs (type 4 chars, e.g. 1A1P)"
      style={{ width: "100%" }}
      options={options}
      optionLabelProp="label"
      filterOption={(input, opt) => opt.label.includes(input.toUpperCase())}
      onSearch={handleSearch}   /* fires every keystroke */
      onSelect={handleSelect}
    />
  );
}