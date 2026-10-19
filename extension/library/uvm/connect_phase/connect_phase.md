**`connect_phase`** — the phase in which components are wired together

Runs after `build_phase`, when every component in the hierarchy exists. It is a function, takes zero time, and executes bottom-up. Its job is to connect TLM ports, exports and imps, and to hand out any handles that could not be resolved during build.

**Signature**

```systemverilog
virtual function void connect_phase(uvm_phase phase);
```

**Rules**

- Call `connect` on the initiator and pass the target: `port.connect(export_or_imp)`.
- Each level connects only its own children and its own ports. Do not reach several levels down; let each parent expose what its children offer.
- The connections are only recorded here. They are resolved and checked after this phase, so a missing connection is reported at end of elaboration, not at the `connect` call.
- Guard connections that involve optional components (`if (cfg.has_scoreboard)`, `if (get_is_active() == UVM_ACTIVE)`).

**Notes**

- Being bottom-up, a child's connections are made before its parent's. The order rarely matters, because resolution happens afterwards.
- A null-handle error here almost always means the component was not created in `build_phase`, often because the agent is passive.

**See also**: `build_phase`, `end_of_elaboration_phase`, `uvm_analysis_port`, `seq_item_port`, `seq_item_export`, `uvm_port_base`

---

**Coding example**

```systemverilog
// Agent: driver to sequencer, and expose the monitor's analysis port
function void connect_phase(uvm_phase phase);
    super.connect_phase(phase);
    ap = mon.ap;
    if (get_is_active() == UVM_ACTIVE)
        drv.seq_item_port.connect(sqr.seq_item_export);
endfunction

// Environment: agents to scoreboard and coverage
function void connect_phase(uvm_phase phase);
    super.connect_phase(phase);
    wr_agt.ap.connect(scb.wr_ap);
    rd_agt.ap.connect(scb.rd_ap);
    wr_agt.ap.connect(cov.analysis_export);

    // Virtual sequencer handles
    vsqr.wr_sqr = wr_agt.sqr;
    vsqr.rd_sqr = rd_agt.sqr;

    // Register model to bus agent
    regmodel.default_map.set_sequencer(bus_agt.sqr, adapter);
endfunction
```

---

**Visual**

<img src="behavior.svg" width="300">
