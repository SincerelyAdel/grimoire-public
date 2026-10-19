**`uvm_sequence_base`** — the non-parameterized core of every sequence

Holds everything about a sequence that does not depend on the item type: starting and stopping, the `pre_`/`post_` hooks, priority, locking, and the low-level item handshake. `uvm_sequence #(REQ, RSP)` extends it and adds the typed `req` / `rsp` handles and `get_response()`. Use this type for a handle that can hold any sequence.

**Declaration**

```systemverilog
class uvm_sequence_base extends uvm_sequence_item;
    function new(string name = "uvm_seq");
```

**Main methods**

| Method | Purpose |
| --- | --- |
| `start(sequencer, parent_sequence = null, this_priority = -1, call_pre_post = 1)` | Execute the sequence |
| `pre_start()`, `pre_body()`, `body()`, `post_body()`, `post_start()` | Execution hooks |
| `pre_do(bit is_item)`, `mid_do(item)`, `post_do(item)` | Hooks around each item or sub-sequence |
| `start_item(item, set_priority = -1, sequencer = null)` / `finish_item(item, set_priority = -1)` | Item handshake |
| `wait_for_grant`, `send_request`, `wait_for_item_done` | The primitives behind `start_item` / `finish_item` |
| `lock(sequencer = null)`, `grab(sequencer = null)`, `unlock`, `ungrab` | Exclusive sequencer access |
| `is_blocked()`, `has_lock()` | Lock state |
| `set_priority(int)` / `get_priority()` | Arbitration priority, default 100 |
| `is_relevant()` / `wait_for_relevant()` | Let a sequence opt out of arbitration temporarily |
| `kill()` | Stop the sequence |
| `get_sequence_state()` / `wait_for_sequence_state(mask)` | `CREATED`, `PRE_START`, `BODY`, `FINISHED`, `STOPPED` and so on |
| `use_response_handler(bit)` / `response_handler(response)` | Asynchronous response handling |
| `starting_phase` | Phase handle, set when started automatically as a default sequence |

**Example**

```systemverilog
task run_phase(uvm_phase phase);
    uvm_sequence_base seq;
    uvm_object        obj;
    string            seq_name = "fifo_wr_seq";

    void'($value$plusargs("SEQ=%s", seq_name));
    obj = uvm_factory::get().create_object_by_name(seq_name, get_full_name(), "seq");
    if (!$cast(seq, obj)) `uvm_fatal("TEST", {"not a sequence: ", seq_name})

    phase.raise_objection(this);
    seq.start(env.wr_agt.sqr);
    phase.drop_objection(this);
endtask
```

**See also**: `uvm_sequence`, `uvm_sequence_item`, `uvm_sequencer`, `body`, `pre_do`, `grab`, `starting_phase`
