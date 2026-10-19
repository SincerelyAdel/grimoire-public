**`phase_ended`** — component callback invoked when any phase has finished

A function called on every component after a phase ends, once its objections are down and `phase_ready_to_end` has not extended it. Use it for cleanup tied to the end of a particular phase.

**Signature**

```systemverilog
virtual function void phase_ended(uvm_phase phase);
```

**Example**

```systemverilog
function void phase_ended(uvm_phase phase);
    super.phase_ended(phase);

    if (phase.get_name() == "main")
        `uvm_info("FIFO_SCB", $sformatf("%0d item(s) compared during main", n_match + n_mismatch), UVM_LOW)

    if (phase.get_name() == "run" && seq_item_port != null && req != null)
        `uvm_info("FIFO_WR_DRV", "run phase ended with an item in progress", UVM_MEDIUM)

    if (phase.get_jump_target() != null)
        `uvm_info("PHASE", {"leaving ", phase.get_name(), " by jump to ",
                            phase.get_jump_target().get_name()}, UVM_LOW)
endfunction
```

**Notes**

- For a task phase, the phase tasks may still be running when this is called; they are killed just afterwards. A raised objection here has no effect.
- `phase.get_jump_target()` is non-null when the phase is ending because of a jump, which lets components distinguish a normal end from an abort.
- It is a function and cannot consume time.

**See also**: `phase_started`, `phase_ready_to_end`, `uvm_phase`, `uvm_phase_state`
