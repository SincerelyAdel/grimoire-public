**`phase_started`** — component callback invoked when any phase begins

A function called on every component at the start of each phase, before the phase method itself runs. One method serves all phases; the argument tells you which. It is the hook for code that must react to phase boundaries generically, such as tracing, or starting something at the beginning of a particular phase.

**Signature**

```systemverilog
virtual function void phase_started(uvm_phase phase);
```

**Example**

```systemverilog
function void phase_started(uvm_phase phase);
    super.phase_started(phase);
    `uvm_info("PHASE", {"entering ", phase.get_name()}, UVM_HIGH)

    if (phase.get_name() == "reset")
        expected.delete();            // forget history whenever reset starts, including after a jump

    if (phase.is(uvm_main_phase::get()))
        n_items_in_main = 0;
endfunction
```

**The three phase callbacks**

| Callback | Called when | Phase state |
| --- | --- | --- |
| `phase_started` | The phase begins | `UVM_PHASE_STARTED` |
| `phase_ready_to_end` | All objections are dropped and the phase is about to end | `UVM_PHASE_READY_TO_END` |
| `phase_ended` | The phase has ended | `UVM_PHASE_ENDED` |

**Notes**

- It is a function: no delays, no blocking calls.
- It is called for every phase, function phases and task phases alike, so always test `phase.get_name()` or use `phase.is()`.
- `uvm_sequencer_base` uses this callback to start default sequences.

**See also**: `phase_ready_to_end`, `phase_ended`, `uvm_phase`, `uvm_phase_state`
