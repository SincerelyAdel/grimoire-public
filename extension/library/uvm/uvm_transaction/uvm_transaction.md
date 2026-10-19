**`uvm_transaction`** — base class for transactions, adding timing and recording to `uvm_object`

Sits between `uvm_object` and `uvm_sequence_item`. It adds a transaction ID, begin/end/accept timestamps and hooks for recording into a waveform database. User transactions should extend `uvm_sequence_item`, not this class, so that they can travel through sequencers.

**Declaration**

```systemverilog
virtual class uvm_transaction extends uvm_object;
    function new(string name = "", uvm_component initiator = null);
```

**Main methods**

| Method | Purpose |
| --- | --- |
| `accept_tr(time accept_time = 0)` | Mark the item as accepted; triggers the `accept` event |
| `begin_tr(time begin_time = 0)` | Mark the start; returns a recording handle |
| `begin_child_tr(time begin_time = 0, integer parent_handle = 0)` | Start as a child of another transaction |
| `end_tr(time end_time = 0, bit free_handle = 1)` | Mark the end |
| `get_begin_time()` / `get_end_time()` / `get_accept_time()` | Read the timestamps |
| `set_transaction_id(integer id)` / `get_transaction_id()` | Used to match responses with requests |
| `get_event_pool()` | Pool holding the `begin`, `end` and `accept` events |
| `enable_recording(...)` / `disable_recording()` / `is_recording_enabled()` | Transaction recording control |
| `do_accept_tr()`, `do_begin_tr()`, `do_end_tr()` | User hooks |

**Example**

```systemverilog
task run_phase(uvm_phase phase);
    forever begin
        seq_item_port.get_next_item(req);
        void'(begin_tr(req, "fifo_writes"));   // component-side recording
        drive_item(req);
        end_tr(req);
        seq_item_port.item_done();
    end
endtask

// Waiting for an item to finish, from a sequence:
uvm_event done = req.get_event_pool().get("end");
done.wait_trigger();
```

**Notes**

- The component methods `begin_tr(tr, stream_name)` and `end_tr(tr)` call the transaction's own methods and add the stream information. Call the component versions from drivers and monitors.
- Recording appears in the waveform viewer only when transaction recording is enabled in the simulator; the switch is tool-specific.

**See also**: `uvm_sequence_item`, `uvm_object`, `uvm_recorder`, `do_record`, `uvm_event`
