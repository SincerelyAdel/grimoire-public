# Animation map

Which pages get an animated **Visual** section, following the standard in [README.md](README.md#animated-pages). A word gets an animation when it describes **behavior over time or the flow of a value**, which a loop of cases shows faster than text. Declarations, types, configuration and naming do not.

Words in one family share one generator function in `tools/animate.py`, with the differences passed in as parameters, so one design covers the whole family. Each page still gets its own files in its folder.

- **Tier 1:** core behavior that every user meets. Done: every Tier 1 word has an animation.
- **Tier 2:** worth animating once Tier 1 is done.
- **No animation:** text and the coding example are enough.

## SystemVerilog

### Tier 1 (done)

| Family | Words | What the loop shows |
| --- | --- | --- |
| Sequential process | `always_ff` | `d` reaches `q` only on `posedge clk`; `rst_n` low forces `q` to 0 |
| Combinational process | `always_comb`, `assign` | the output follows every input change at once, no clock |
| Latch process | `always_latch` | `q` follows `d` while enable is high, holds when it drops |
| General process | `always`, `initial`, `final` | `always` repeats after each event; `initial` runs once at time 0; `final` runs once at the end |
| Edge events | `posedge`, `negedge`, `edge` | a waveform drawing itself left to right, with the rising edges, the falling edges, or the whole wave glowing |
| Events and waiting | `event`, `wait`, `wait_order`, `iff` | a blocked process wakes when the event fires or the condition becomes true |
| Parallel processes | `fork`, `join`, `join_any`, `join_none`, `disable` | parallel threads start; the parent resumes after all, the first, or none of them; `disable` kills the rest |
| Logic gates | `and`, `or`, `nand`, `nor`, `xor`, `xnor`, `not`, `buf` | inputs cycle through their combinations and the output lights when it is 1 |
| Tri-state gates | `bufif0`, `bufif1`, `notif0`, `notif1` | the output follows the input while enabled and floats to `z` when not |
| Branching | `if`, `else`, `case`, `casex`, `casez`, `unique`, `unique0`, `priority` | the select value lights the one branch that runs, as a multiplexer |
| Concurrent assertions | `assert`, `property`, `sequence`, `throughout`, `within`, `until`, `eventually`, `nexttime` | the property is checked cycle by cycle and passes or fails |

### Tier 2

| Family | Words | What the loop shows |
| --- | --- | --- |
| Loops | `for`, `foreach`, `while`, `do`, `repeat`, `forever`, `break`, `continue` | the loop body runs once per pass; `break` leaves early, `continue` skips ahead |
| Override | `force`, `release`, `deassign` | the forced value wins over the drivers until it is released |
| Net resolution | `wire`, `tri`, `uwire`, `wand`, `wor`, `triand`, `trior`, `tri0`, `tri1`, `trireg`, `supply0`, `supply1`, `pullup`, `pulldown` | several drivers meet on one net and the resolved value appears |
| Drive strengths | `strong0`, `strong1`, `pull0`, `pull1`, `weak0`, `weak1`, `highz0`, `highz1`, `small`, `medium`, `large` | the stronger of two conflicting drivers wins |
| Switches | `nmos`, `pmos`, `cmos`, `rnmos`, `rpmos`, `rcmos`, `tran`, `tranif0`, `tranif1`, `rtran`, `rtranif0`, `rtranif1` | the control opens or closes the path between the terminals |
| More assertion operators | `assume`, `cover`, `expect`, `implies`, `intersect`, `first_match`, `until_with`, `s_until`, `s_until_with`, `s_nexttime`, `s_eventually`, `s_always`, `accept_on`, `reject_on`, `sync_accept_on`, `sync_reject_on` | as for the Tier 1 assertions |
| Randomization | `rand`, `randc`, `dist`, `randcase`, `randsequence`, `constraint`, `soft`, `solve`, `before`, `inside` | draws land in the allowed values; `randc` uses each value once per round |
| Coverage | `covergroup`, `coverpoint`, `bins`, `cross`, `binsof`, `ignore_bins`, `illegal_bins`, `wildcard` | sampled values fill their bins |
| Scheduling | `clocking`, `program` | inputs are sampled before the clock edge and outputs driven after it |
| Elaboration | `generate`, `genvar` | the loop stamps out copies of the block |
| Storage | `automatic`, `static` | two calls share one variable, or each gets its own |
| Connections | `alias`, `inout` | two names drive one net; a port drives in both directions |
| Pulse handling | `pulsestyle_ondetect`, `pulsestyle_onevent`, `showcancelled`, `noshowcancelled` | a pulse shorter than the delay is cancelled or shown as `x` |

### No animation

`begin`, `bind`, `bit`, `byte`, `cell`, `chandle`, `checker`, `class`, `config`, `const`, `context`, `default`, `defparam`, `design`, `enum`, `export`, `extends`, `extern`, `forkjoin`, `function`, `global`, `ifnone`, `implements`, `import`, `incdir`, `include`, `input`, `instance`, `int`, `integer`, `interconnect`, `interface`, `let`, `liblist`, `library`, `local`, `localparam`, `logic`, `longint`, `macromodule`, `matches`, `modport`, `module`, `nettype`, `new`, `null`, `output`, `package`, `packed`, `parameter`, `primitive`, `protected`, `pure`, `real`, `realtime`, `ref`, `reg`, `restrict`, `return`, `scalared`, `shortint`, `shortreal`, `signed`, `specify`, `specparam`, `string`, `strong`, `struct`, `super`, `table`, `tagged`, `task`, `this`, `time`, `timeprecision`, `timeunit`, `type`, `typedef`, `union`, `unsigned`, `untyped`, `use`, `var`, `vectored`, `virtual`, `void`, `weak`, `with`

## UVM

### Tier 1 (done)

| Family | Words | What the loop shows |
| --- | --- | --- |
| Phases | `uvm_phase`, `build_phase`, `connect_phase`, `end_of_elaboration_phase`, `start_of_simulation_phase`, `run_phase`, `extract_phase`, `check_phase`, `report_phase`, `final_phase` | the phases light in order, with this page's phase highlighted |
| Run-time phases | `reset_phase`, `configure_phase`, `main_phase`, `shutdown_phase` | the run-time schedule running alongside `run_phase` |
| Objections | `uvm_objection`, `raise_objection`, `drop_objection`, `phase_done`, `set_drain_time`, `all_dropped`, `phase_ready_to_end` | the count rises and falls, and the phase ends only when it reaches 0 (after the drain time) |
| Sequence to driver | `start_item`, `finish_item`, `get_next_item`, `item_done`, `try_next_item`, `seq_item_port`, `seq_item_export`, `uvm_seq_item_pull_port`, `wait_for_grant`, `body` | an item travels sequence, sequencer, driver, and the done signal travels back |
| Item macros | `uvm_do`, `uvm_send`, `uvm_rand_send`, `uvm_create` | the same handshake, with the steps each macro performs lit |
| Responses | `get_response`, `rsp_port`, `set_id_info` | the response travels back from the driver to the sequence that sent the request |
| Analysis | `uvm_analysis_port`, `uvm_analysis_imp`, `uvm_analysis_export`, `analysis_export`, `uvm_subscriber`, `uvm_analysis_imp_decl` | one `write` fans out to every connected subscriber |
| TLM FIFOs | `uvm_tlm_fifo`, `uvm_tlm_analysis_fifo`, `uvm_blocking_put_port`, `uvm_tlm_req_rsp_channel` | items queue up; `put` blocks when full and `get` blocks when empty |
| Agent roles | `uvm_agent`, `uvm_driver`, `uvm_monitor`, `uvm_sequencer`, `uvm_sequence` | where each component sits and what flows between them |
| Active and passive | `is_active`, `get_is_active`, `UVM_ACTIVE`, `UVM_PASSIVE`, `uvm_active_passive_enum` | the driver and sequencer exist only in active mode; the monitor always does |

### Tier 2

| Family | Words | What the loop shows |
| --- | --- | --- |
| Arbitration | `grab`, `set_arbitration`, `uvm_sequencer_arb_mode`, `stop_sequences` | competing sequences queue at the sequencer and one is granted |
| Sequence hooks | `pre_start`, `pre_body`, `pre_do` | the order the hooks are called in around `body` and each item |
| Factory | `uvm_factory`, `type_id`, `create_component`, `set_type_override`, `set_inst_override`, `uvm_set_type_override` | a create request comes back as the override type |
| Configuration | `uvm_config_db`, `uvm_resource_db`, `wait_modified`, `apply_config_settings` | a value set high in the hierarchy is found by a lower component's `get` |
| Verbosity | `uvm_info`, `uvm_verbosity`, `UVM_NONE`, `UVM_LOW`, `UVM_MEDIUM`, `UVM_HIGH`, `UVM_FULL`, `UVM_DEBUG`, `set_report_verbosity_level`, `UVM_VERBOSITY_option`, `uvm_set_verbosity` | messages above the threshold are dropped, the rest printed |
| Register layer | `uvm_reg_predictor`, `uvm_reg_adapter`, `uvm_path_e`, `uvm_reg_map` | a register access becomes a bus transaction, and the mirror updates |
| Synchronization | `uvm_event`, `uvm_barrier`, `uvm_wait_for_nba_region` | waiting processes are released together |
| Watchdogs | `uvm_heartbeat`, `set_timeout`, `UVM_TIMEOUT` | the test ends if activity or time runs out |
| Phase callbacks | `phase_started`, `phase_ended` | the callbacks fire as each phase begins and ends |
| Report catching | `uvm_report_catcher` | a report is intercepted and changed before it prints |

### No animation

`clone`, `convert2string`, `do_compare`, `do_copy`, `do_pack`, `do_print`, `do_record`, `get_full_name`, `get_name`, `get_parent`, `get_type_name`, `global_stop_request`, `m_sequencer`, `p_sequencer`, `pre_abort`, `print_config`, `print_topology`, `run_test`, `set_config_int`, `sprint`, `starting_phase`, `uvm_action`, `UVM_ALL_ON`, `uvm_bitstream_t`, `uvm_callback`, `uvm_callbacks`, `uvm_cmdline_processor`, `uvm_comparer`, `uvm_component`, `uvm_component_param_utils`, `uvm_component_utils`, `uvm_component_utils_begin`, `uvm_coreservice_t`, `uvm_declare_p_sequencer`, `uvm_do_callbacks`, `uvm_domain`, `uvm_env`, `uvm_error`, `UVM_ERROR_severity`, `uvm_event_pool`, `uvm_fatal`, `UVM_FATAL_severity`, `uvm_field_int`, `uvm_hdl_read`, `UVM_HEX`, `uvm_info_context`, `UVM_INFO_severity`, `uvm_macros`, `UVM_MAX_QUIT_COUNT`, `uvm_mem`, `UVM_NO_RELNOTES`, `uvm_object`, `uvm_object_param_utils`, `uvm_object_utils`, `uvm_object_utils_begin`, `uvm_object_wrapper`, `UVM_OBJECTION_TRACE`, `uvm_packer`, `uvm_phase_state`, `uvm_pkg`, `uvm_pool`, `uvm_port_base`, `uvm_printer`, `uvm_queue`, `uvm_recorder`, `uvm_reg`, `uvm_reg_block`, `uvm_reg_bus_op`, `uvm_reg_field`, `uvm_reg_hw_reset_seq`, `uvm_reg_item`, `uvm_reg_sequence`, `uvm_register_cb`, `uvm_report_enabled`, `uvm_report_info`, `uvm_report_object`, `uvm_report_server`, `uvm_root`, `uvm_scoreboard`, `uvm_sequence_base`, `uvm_sequence_item`, `uvm_set_config_int`, `uvm_severity`, `uvm_status_e`, `uvm_test`, `uvm_test_done`, `uvm_test_top`, `UVM_TESTNAME`, `uvm_tlm_generic_payload`, `uvm_top`, `uvm_transaction`, `uvm_warning`, `UVM_WARNING_severity`
