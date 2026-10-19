**`set_arbitration`** — choose how a sequencer picks between competing sequences

A sequencer method that sets the arbitration mode. The mode decides which waiting sequence is granted when more than one has an item ready.

**Signature**

```systemverilog
function void         set_arbitration(SEQ_ARB_TYPE val);        // UVM 1.1
function void         set_arbitration(UVM_SEQ_ARB_TYPE val);    // UVM 1.2
function SEQ_ARB_TYPE get_arbitration();
```

**Modes**

| UVM 1.1d name | UVM 1.2 name | Behaviour |
| --- | --- | --- |
| `SEQ_ARB_FIFO` | `UVM_SEQ_ARB_FIFO` | Oldest request first, priority ignored (default) |
| `SEQ_ARB_WEIGHTED` | `UVM_SEQ_ARB_WEIGHTED` | Random, weighted by priority |
| `SEQ_ARB_RANDOM` | `UVM_SEQ_ARB_RANDOM` | Random, priority ignored |
| `SEQ_ARB_STRICT_FIFO` | `UVM_SEQ_ARB_STRICT_FIFO` | Highest priority first, oldest among equals |
| `SEQ_ARB_STRICT_RANDOM` | `UVM_SEQ_ARB_STRICT_RANDOM` | Highest priority first, random among equals |
| `SEQ_ARB_USER` | `UVM_SEQ_ARB_USER` | Decided by `user_priority_arbitration()` |

**Example**

```systemverilog
task run_phase(uvm_phase phase);
    phase.raise_objection(this);

    env.wr_agt.sqr.set_arbitration(SEQ_ARB_STRICT_FIFO);
    fork
        normal_seq.start(env.wr_agt.sqr, null, 100);     // third argument is the priority
        urgent_seq.start(env.wr_agt.sqr, null, 300);     // always granted first
    join

    phase.drop_objection(this);
endtask
```

**Notes**

- Priorities only matter in the `WEIGHTED` and `STRICT` modes. In the default mode a higher priority changes nothing.
- The default priority of a sequence is 100; a child inherits its parent's unless one is given.
- Arbitration happens at the moment the driver asks for an item, which is why items should be randomized after `start_item()` returns.
- To exclude other sequences completely, use `grab()` or `lock()` instead of a high priority.

**See also**: `uvm_sequencer_arb_mode`, `grab`, `uvm_sequencer`, `start_item`, `uvm_sequence`
