**`uvm_sequencer_arb_mode`** — how a sequencer chooses between competing sequences

When several sequences running on one sequencer have an item ready at the same time, the arbitration mode decides which one is granted. Set it with `set_arbitration()` on the sequencer.

**Declaration**

```systemverilog
// UVM 1.2 and IEEE 1800.2
typedef enum {
    UVM_SEQ_ARB_FIFO,
    UVM_SEQ_ARB_WEIGHTED,
    UVM_SEQ_ARB_RANDOM,
    UVM_SEQ_ARB_STRICT_FIFO,
    UVM_SEQ_ARB_STRICT_RANDOM,
    UVM_SEQ_ARB_USER
} uvm_sequencer_arb_mode;

// UVM 1.1d: the same values without the UVM_ prefix, in the type SEQ_ARB_TYPE
typedef enum { SEQ_ARB_FIFO, SEQ_ARB_WEIGHTED, SEQ_ARB_RANDOM,
               SEQ_ARB_STRICT_FIFO, SEQ_ARB_STRICT_RANDOM, SEQ_ARB_USER } SEQ_ARB_TYPE;
```

| Mode | Which request is granted |
| --- | --- |
| `..._FIFO` | The oldest request; priorities ignored. The default. |
| `..._WEIGHTED` | Random, weighted by priority |
| `..._RANDOM` | Random; priorities ignored |
| `..._STRICT_FIFO` | The highest priority; oldest first among equals |
| `..._STRICT_RANDOM` | The highest priority; random among equals |
| `..._USER` | Whatever the sequencer's `user_priority_arbitration()` returns |

**Example**

```systemverilog
// Background traffic with occasional high-priority interrupts
env.wr_agt.sqr.set_arbitration(SEQ_ARB_STRICT_FIFO);       // UVM_SEQ_ARB_STRICT_FIFO in 1.2

fork
    background_seq.start(env.wr_agt.sqr, null, 100);        // default priority
    urgent_seq.start(env.wr_agt.sqr, null, 500);            // wins whenever it has an item
join
```

**Custom arbitration**

```systemverilog
class fifo_sequencer extends uvm_sequencer #(fifo_transaction);
    `uvm_component_utils(fifo_sequencer)

    virtual function integer user_priority_arbitration(integer avail_sequences[$]);
        return avail_sequences[$];          // newest request first
    endfunction
endclass

sqr.set_arbitration(SEQ_ARB_USER);
```

**Notes**

- Priority is the third argument of `start()`, or of `start_item()` per item; higher numbers win, and the default is 100.
- Priorities have no effect in the default FIFO mode. This is the usual reason a "high-priority" sequence does not get ahead.
- Exclusive access, as opposed to preference, is done with `lock()` and `grab()`.

**See also**: `set_arbitration`, `uvm_sequencer`, `grab`, `uvm_sequence`, `start_item`
