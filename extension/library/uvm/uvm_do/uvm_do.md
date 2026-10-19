**`` `uvm_do ``** — create, randomize and send an item or sub-sequence in one line

A shortcut used inside a sequence's `body()`. For a sequence item it creates the object through the factory, waits for the sequencer grant, randomizes it and sends it to the driver. For a sequence it creates, randomizes and starts it as a child of the current sequence.

**Syntax and family**

| Macro | Adds |
| --- | --- |
| `` `uvm_do(SEQ_OR_ITEM) `` | Nothing: default randomization |
| `` `uvm_do_with(SEQ_OR_ITEM, CONSTRAINTS) `` | Inline constraints |
| `` `uvm_do_pri(SEQ_OR_ITEM, PRIORITY) `` | A priority for arbitration |
| `` `uvm_do_pri_with(SEQ_OR_ITEM, PRIORITY, CONSTRAINTS) `` | Both |
| `` `uvm_do_on(SEQ_OR_ITEM, SEQR) `` | A target sequencer, for virtual sequences |
| `` `uvm_do_on_with(SEQ_OR_ITEM, SEQR, CONSTRAINTS) `` | Sequencer and constraints |
| `` `uvm_do_on_pri(SEQ_OR_ITEM, SEQR, PRIORITY) `` | Sequencer and priority |
| `` `uvm_do_on_pri_with(SEQ_OR_ITEM, SEQR, PRIORITY, CONSTRAINTS) `` | All three |

**What `` `uvm_do(req) `` does for an item**

```systemverilog
req = fifo_transaction::type_id::create("req");
start_item(req);
if (!req.randomize()) `uvm_warning("RNDFLD", "Randomization failed in uvm_do action")
finish_item(req);
```

**Notes**

- The explicit `start_item` / `finish_item` form is easier to debug and lets you set fields between randomization and sending, so many coding guidelines prefer it.
- The item is randomized late, after the sequencer grants access, so it can react to the current DUT state.
- The macro variable must be declared; `req` already is, in every `uvm_sequence`.
- These macros are removed from the IEEE 1800.2 standard, although libraries still ship them.

**See also**: `uvm_create`, `uvm_send`, `start_item`, `finish_item`, `uvm_declare_p_sequencer`, `uvm_sequence`

---

**Coding example**

```systemverilog
class fifo_wr_seq extends uvm_sequence #(fifo_transaction);
    `uvm_object_utils(fifo_wr_seq)

    task body();
        repeat (8)
            `uvm_do_with(req, { delay inside {[0:2]}; })
    endtask
endclass

class fifo_virtual_seq extends uvm_sequence;
    `uvm_object_utils(fifo_virtual_seq)
    `uvm_declare_p_sequencer(fifo_virtual_sequencer)

    fifo_wr_seq wr_seq;
    fifo_rd_seq rd_seq;

    task body();
        fork
            `uvm_do_on(wr_seq, p_sequencer.wr_sqr)
            `uvm_do_on(rd_seq, p_sequencer.rd_sqr)
        join
    endtask
endclass
```

---

**Visual**

<img src="behavior.svg" width="300">
