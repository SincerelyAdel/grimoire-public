**`` `uvm_declare_p_sequencer ``** — give a sequence a typed handle to its sequencer

Declares a variable named `p_sequencer` of the given sequencer type inside a sequence, and generates the code that casts the generic `m_sequencer` handle to it when the sequence starts. Use it when the sequence needs something that lives on a specific sequencer class: sub-sequencer handles in a virtual sequencer, a configuration object, or a virtual interface.

**Syntax**

```systemverilog
`uvm_declare_p_sequencer(SEQUENCER_TYPE)
```

**Example**

```systemverilog
class fifo_virtual_sequencer extends uvm_sequencer;
    `uvm_component_utils(fifo_virtual_sequencer)
    fifo_sequencer wr_sqr;
    fifo_sequencer rd_sqr;
    function new(string name, uvm_component parent);
        super.new(name, parent);
    endfunction
endclass

class fifo_fill_drain_seq extends uvm_sequence;
    `uvm_object_utils(fifo_fill_drain_seq)
    `uvm_declare_p_sequencer(fifo_virtual_sequencer)

    task body();
        fifo_wr_seq wr = fifo_wr_seq::type_id::create("wr");
        fifo_rd_seq rd = fifo_rd_seq::type_id::create("rd");
        wr.start(p_sequencer.wr_sqr);
        rd.start(p_sequencer.rd_sqr);
    endtask
endclass
```

**Notes**

- The macro overrides `m_set_p_sequencer()`. If the sequence is started on a sequencer of the wrong type, the cast fails and UVM reports a fatal error.
- It ties the sequence to one sequencer type, which reduces reuse. Sequences that only send items should use plain `m_sequencer` and need no macro.
- `p_sequencer` is only valid once the sequence has been started; it is null in the constructor.

**See also**: `p_sequencer`, `m_sequencer`, `uvm_sequencer`, `uvm_do`
