**`uvm_phase_state`** — the lifecycle states of a phase (`UVM_PHASE_*`)

Every phase moves through a fixed series of states. Code can read the state with `phase.get_state()` or block on it with `phase.wait_for_state()`, which is the supported way to synchronise with phase boundaries from outside a phase method.

**Declaration**

```systemverilog
typedef enum {
    UVM_PHASE_DORMANT      = 1,
    UVM_PHASE_SCHEDULED    = 2,
    UVM_PHASE_SYNCING      = 4,
    UVM_PHASE_STARTED      = 8,
    UVM_PHASE_EXECUTING    = 16,
    UVM_PHASE_READY_TO_END = 32,
    UVM_PHASE_ENDED        = 64,
    UVM_PHASE_CLEANUP      = 128,
    UVM_PHASE_DONE         = 256,
    UVM_PHASE_JUMPING      = 512
} uvm_phase_state;
```

| State | Meaning | Component callback |
| --- | --- | --- |
| `UVM_PHASE_DORMANT` | Not yet reached | |
| `UVM_PHASE_SCHEDULED` | Predecessors finished; about to run | |
| `UVM_PHASE_SYNCING` | Waiting for phases in other domains that are synchronised with it | |
| `UVM_PHASE_STARTED` | Started | `phase_started()` |
| `UVM_PHASE_EXECUTING` | The phase method is running on the components | the phase method itself |
| `UVM_PHASE_READY_TO_END` | All objections dropped | `phase_ready_to_end()`; raising an objection here keeps the phase alive |
| `UVM_PHASE_ENDED` | Finished | `phase_ended()` |
| `UVM_PHASE_CLEANUP` | Remaining phase processes are being killed | |
| `UVM_PHASE_DONE` | Complete | |
| `UVM_PHASE_JUMPING` | A phase jump is in progress | |

The values are one-hot so that several can be combined in a mask.

**Example**

```systemverilog
// Wait, from any process, until the main phase has finished
uvm_phase main_ph = uvm_main_phase::get();
main_ph.wait_for_state(UVM_PHASE_DONE, UVM_GTE);

// Do something only while the run phase is executing
if (uvm_run_phase::get().get_state() == UVM_PHASE_EXECUTING)
    sample_coverage();
```

The second argument of `wait_for_state` is a `uvm_wait_op`: `UVM_EQ`, `UVM_NE`, `UVM_LT`, `UVM_LTE`, `UVM_GT` or `UVM_GTE`.

**See also**: `uvm_phase`, `phase_started`, `phase_ready_to_end`, `phase_ended`, `uvm_domain`
