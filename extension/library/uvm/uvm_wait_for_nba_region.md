**`uvm_wait_for_nba_region`** — wait until the non-blocking assignment region of the current time step

A global task in `uvm_pkg`. It returns later in the same simulation time step, after all active-region activity has settled and non-blocking assignments have been applied. The library uses it to let every process that is ready at the current time run before a decision is taken, for example before a sequencer arbitrates.

**Signature**

```systemverilog
task uvm_wait_for_nba_region;
```

**Example**

```systemverilog
// Let all sequences that start at this time request the sequencer before sampling state
task body();
    uvm_wait_for_nba_region();
    if (p_sequencer.cfg.fill_level == 0) ...
endtask

// Give analysis subscribers a chance to process a transaction written in this time step
ap.write(tr);
uvm_wait_for_nba_region();
check_scoreboard_state();
```

**Notes**

- It advances no simulation time. `$time` is the same before and after.
- Use it instead of `#0`, which only yields to the inactive region and makes the result depend on how many `#0` delays other code uses.
- Needing it in testbench code often signals a race that is better removed, for example by sampling through a clocking block or by waiting for an explicit event.
- The implementation is a non-blocking assignment to an internal variable followed by a wait on it.

**See also**: `uvm_event`, `uvm_sequencer`, `run_phase`
