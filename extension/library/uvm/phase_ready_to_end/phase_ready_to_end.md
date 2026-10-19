**`phase_ready_to_end`** — component callback that offers a last chance to keep a phase alive

Called on every component when all objections to a task phase have been dropped and the phase is about to end. If a component raises an objection inside this callback, the phase continues; when that objection is later dropped, the callback is invoked again. It lets a checking component finish its work without the test having to know about it.

**Signature**

```systemverilog
virtual function void phase_ready_to_end(uvm_phase phase);
```

**How it works**

1. The last objection is dropped; the phase enters `UVM_PHASE_READY_TO_END`.
2. The library calls `phase_ready_to_end` on every component.
3. If any objection was raised, the phase returns to executing and waits again.
4. Steps 1 to 3 repeat, up to a maximum number of iterations (20 by default), then the phase ends.

**Notes**

- It is a function, so the waiting must be done in a forked task, as above.
- Always bound the wait with a timeout, or a missing transaction turns into a hang.
- Check the phase name; the callback fires for every phase.
- This is the clean alternative to guessing a drain time in the test.

**See also**: `phase_started`, `phase_ended`, `raise_objection`, `drop_objection`, `set_drain_time`, `run_phase`, `uvm_phase_state`

---

**Coding example**

```systemverilog
class fifo_scoreboard extends uvm_scoreboard;
    fifo_transaction expected[$];

    function void phase_ready_to_end(uvm_phase phase);
        if (phase.get_name() != "run") return;
        if (expected.size() == 0) return;

        phase.raise_objection(this, "scoreboard waiting for outstanding reads");
        fork
            wait_until_empty(phase);
        join_none
    endfunction

    task wait_until_empty(uvm_phase phase);
        fork
            wait (expected.size() == 0);
            #10us `uvm_error("FIFO_SCB", $sformatf("%0d item(s) never read", expected.size()))
        join_any
        disable fork;
        phase.drop_objection(this, "scoreboard done");
    endtask
endclass
```

---

**Visual**

<img src="behavior.svg" width="300">
