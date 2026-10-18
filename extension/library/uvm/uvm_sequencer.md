**`uvm_sequencer`** — the component that routes sequence items from sequences to a driver

A sequencer sits between sequences and the driver. Sequences running on it request permission to send an item; the sequencer arbitrates between them, hands the chosen item to the driver through its `seq_item_export`, and routes any response back to the sequence that sent the request.

**Declaration**

```systemverilog
class uvm_sequencer #(type REQ = uvm_sequence_item,
                      type RSP = REQ) extends uvm_sequencer_param_base #(REQ, RSP);

    uvm_seq_item_pull_imp #(REQ, RSP, this_type) seq_item_export;

    function new(string name, uvm_component parent = null);
```

**Usage**

Most sequencers need no code at all. Either use a typedef or a minimal class:

```systemverilog
typedef uvm_sequencer #(fifo_transaction) fifo_sequencer;

// or, when you want a named type to extend later:
class fifo_sequencer extends uvm_sequencer #(fifo_transaction);
    `uvm_component_utils(fifo_sequencer)
    function new(string name = "fifo_sequencer", uvm_component parent = null);
        super.new(name, parent);
    endfunction
endclass
```

Connect it in the agent and start sequences on it:

```systemverilog
drv.seq_item_port.connect(sqr.seq_item_export);   // agent connect_phase
seq.start(env.wr_agt.sqr);                        // test run_phase
```

**Main methods**

| Method | Purpose |
| --- | --- |
| `set_arbitration(mode)` / `get_arbitration()` | How competing sequences are chosen; default `SEQ_ARB_FIFO` |
| `stop_sequences()` | Kill every sequence running on the sequencer, for example on reset |
| `is_grabbed()`, `current_grabber()` | Lock state |
| `has_do_available()` | Whether any sequence has an item ready |
| `get_num_reqs_sent()`, `get_num_rsps_received()` | Counters |
| `set_response_queue_depth(int)` | Response queue size, default 8, `-1` for unbounded |

**Default sequence**

A sequence can be started automatically in a given phase:

```systemverilog
uvm_config_db #(uvm_object_wrapper)::set(this, "env.wr_agt.sqr.main_phase",
                                         "default_sequence", fifo_wr_seq::type_id::get());
```

**Virtual sequencer**

A sequencer with no driver, holding handles to other sequencers, so one virtual sequence can coordinate several interfaces:

```systemverilog
class fifo_virtual_sequencer extends uvm_sequencer;
    `uvm_component_utils(fifo_virtual_sequencer)
    fifo_sequencer wr_sqr;
    fifo_sequencer rd_sqr;
    function new(string name, uvm_component parent);
        super.new(name, parent);
    endfunction
endclass
```

**Notes**

- One sequencer serves exactly one driver.
- Unused responses pile up: if the driver sends responses and no sequence calls `get_response()`, the queue overflows with a "response queue overflow" error.
- Explicitly starting sequences from the test is easier to follow than default sequences and is the more common style.

**See also**: `uvm_sequence`, `uvm_driver`, `seq_item_export`, `m_sequencer`, `p_sequencer`, `set_arbitration`, `grab`
