**`` `uvm_info_context ``** — report through a chosen component (`` `uvm_*_context ``)

The `_context` macros behave like `` `uvm_info ``, `` `uvm_warning ``, `` `uvm_error `` and `` `uvm_fatal ``, but take one extra argument: the report object whose verbosity, actions and hierarchical name are used. They exist for code that is not itself a component, mainly sequences, transactions and plain helper classes.

**Syntax**

```systemverilog
`uvm_info_context(ID, MSG, VERBOSITY, CONTEXT)
`uvm_warning_context(ID, MSG, CONTEXT)
`uvm_error_context(ID, MSG, CONTEXT)
`uvm_fatal_context(ID, MSG, CONTEXT)
```

| Argument | Meaning |
| --- | --- |
| `CONTEXT` | A handle to a `uvm_report_object`, normally a component, that issues the report. |

**Example**

```systemverilog
class fifo_wr_seq extends uvm_sequence #(fifo_transaction);
    `uvm_object_utils(fifo_wr_seq)

    task body();
        repeat (n_items) begin
            req = fifo_transaction::type_id::create("req");
            start_item(req);
            if (!req.randomize())
                `uvm_error_context("FIFO_WR_SEQ", "randomize failed", m_sequencer)
            finish_item(req);
            `uvm_info_context("FIFO_WR_SEQ", req.convert2string(), UVM_HIGH, m_sequencer)
        end
    endtask
endclass
```

**Notes**

- With `m_sequencer` as context, the message shows the sequencer's path and obeys verbosity settings applied to that part of the hierarchy.
- In UVM 1.1d a plain `` `uvm_info `` inside a sequence already reports through the sequencer and appends the sequence path, so the context form is mostly needed in plain objects.
- Passing `uvm_top` (or `uvm_root::get()`) reports from the top of the hierarchy.

**See also**: `uvm_info`, `uvm_error`, `m_sequencer`, `uvm_report_object`
