**`starting_phase`** — the phase a default sequence was started in (`starting_phase`, `get_starting_phase`)

A member of every sequence. When a sequencer starts a sequence automatically as the default sequence of a phase, it stores that phase here. The sequence uses it to raise and drop the phase's objection, since nobody else will keep the phase alive on its behalf. When a sequence is started by an explicit `start()` call, the member stays null.

**Declaration**

```systemverilog
// UVM 1.1
uvm_phase starting_phase;

// UVM 1.2 and IEEE 1800.2
function uvm_phase get_starting_phase();
function void      set_starting_phase(uvm_phase phase);
function void      set_automatic_phase_objection(bit value);
```

**Example (UVM 1.1)**

```systemverilog
class fifo_wr_seq extends uvm_sequence #(fifo_transaction);
    `uvm_object_utils(fifo_wr_seq)

    task body();
        if (starting_phase != null)
            starting_phase.raise_objection(this, "fifo_wr_seq");

        repeat (16) begin
            req = fifo_transaction::type_id::create("req");
            start_item(req);
            void'(req.randomize());
            finish_item(req);
        end

        if (starting_phase != null)
            starting_phase.drop_objection(this, "fifo_wr_seq");
    endtask
endclass

// Test: make it the default sequence of main_phase
uvm_config_db #(uvm_object_wrapper)::set(this, "env.wr_agt.sqr.main_phase",
                                         "default_sequence", fifo_wr_seq::type_id::get());
```

**Example (UVM 1.2)**

```systemverilog
function new(string name = "fifo_wr_seq");
    super.new(name);
    set_automatic_phase_objection(1);     // raise before pre_start, drop after post_start
endfunction
```

or, by hand:

```systemverilog
uvm_phase phase = get_starting_phase();
if (phase != null) phase.raise_objection(this);
```

**Notes**

- Always test for null. The same sequence is often also started explicitly, or as a child of another sequence, and then the member is not set.
- Only the root sequence gets the phase; child sequences started from it see null unless you copy the handle down.
- In UVM 1.2 the variable still exists but is deprecated; the library warns if it is assigned directly.
- Tests that start sequences explicitly and hold the objection themselves never need this.

**See also**: `raise_objection`, `drop_objection`, `main_phase`, `pre_body`, `uvm_sequence`, `uvm_sequencer`
