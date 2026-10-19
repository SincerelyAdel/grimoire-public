**`wait_for_grant`** — the low-level steps behind `start_item` and `finish_item` (`wait_for_grant`, `send_request`, `wait_for_item_done`)

Three sequence methods that together send one item to the driver. `start_item()` and `finish_item()` are thin wrappers around them. Call them directly only when you need to do something between the individual steps that the wrappers do not allow.

**Signatures**

```systemverilog
virtual task          wait_for_grant    (int item_priority = -1, bit lock_request = 0);
virtual function void send_request      (uvm_sequence_item request, bit rerandomize = 0);
virtual task          wait_for_item_done(int transaction_id = -1);
```

| Method | Does |
| --- | --- |
| `wait_for_grant` | Asks the sequencer for permission to send and blocks until arbitration selects this sequence |
| `send_request` | Hands the item to the sequencer for the driver. Must follow `wait_for_grant` with no delay in between. If `rerandomize` is 1, the item is randomized first. |
| `wait_for_item_done` | Blocks until the driver calls `item_done()` for the item, or for the given transaction ID |

**How the wrappers map onto them**

```systemverilog
// start_item(req) is roughly:
req.set_item_context(this, m_sequencer);
wait_for_grant();
pre_do(1);

// finish_item(req) is roughly:
mid_do(req);
send_request(req);
wait_for_item_done();
post_do(req);
```

**Example**

```systemverilog
task body();
    req = fifo_transaction::type_id::create("req");
    req.set_item_context(this, m_sequencer);      // set_sequencer + set_parent_sequence

    wait_for_grant();
    if (!req.randomize()) `uvm_error("SEQ", "randomize failed")
    send_request(req);
    wait_for_item_done();
endtask
```

**Notes**

- No simulation time may pass between `wait_for_grant` returning and `send_request`. The sequencer is held for that whole time, and the driver is left waiting.
- These calls skip the `pre_do`, `mid_do` and `post_do` hooks unless you invoke them yourself.
- Prefer `start_item` / `finish_item`. The low-level form exists mainly for backward compatibility and for unusual handshakes.

**See also**: `start_item`, `finish_item`, `item_done`, `pre_do`, `uvm_sequence_base`, `uvm_sequencer`
