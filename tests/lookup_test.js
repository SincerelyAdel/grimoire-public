const assert = require('assert');
const path = require('path');
const lookup = require('../extension/lookup');

const library = path.join(__dirname, '..', 'extension', 'library');
const dirs = ['sv', 'uvm'].map((name) => path.join(library, name));

const cases = [
  ['always_ff', 'sv/always_ff'],
  ['uvm_component', 'uvm/uvm_component'],
  ['`uvm_info', 'uvm/uvm_info'],
  ['`uvm_component_utils', 'uvm/uvm_component_utils'],
  ['`uvm_component_utils_end', 'uvm/uvm_component_utils_begin'],
  ['`uvm_field_enum', 'uvm/uvm_field_int'],
  ['`uvm_field_aa_int_string', 'uvm/uvm_field_int'],
  ['`uvm_error_context', 'uvm/uvm_info_context'],
  ['`uvm_do_with', 'uvm/uvm_do'],
  ['`uvm_do_on_pri_with', 'uvm/uvm_do'],
  ['`uvm_do_callbacks', 'uvm/uvm_do_callbacks'],
  ['`uvm_do_obj_callbacks_exit_on', 'uvm/uvm_do_callbacks'],
  ['`uvm_rand_send_with', 'uvm/uvm_rand_send'],
  ['`uvm_analysis_imp_decl', 'uvm/uvm_analysis_imp_decl'],
  ['`uvm_blocking_put_imp_decl', 'uvm/uvm_analysis_imp_decl'],
  ['uvm_analysis_imp', 'uvm/uvm_analysis_imp'],
  ['uvm_analysis_imp_wr', 'uvm/uvm_analysis_imp_decl'],
  ['uvm_analysis_imp_rd', 'uvm/uvm_analysis_imp_decl'],
  ['uvm_analysis_port', 'uvm/uvm_analysis_port'],
  ['uvm_blocking_get_port', 'uvm/uvm_blocking_put_port'],
  ['uvm_nonblocking_put_imp', 'uvm/uvm_blocking_put_port'],
  ['uvm_seq_item_pull_imp', 'uvm/uvm_seq_item_pull_port'],
  ['uvm_tlm_analysis_fifo', 'uvm/uvm_tlm_analysis_fifo'],
  ['uvm_tlm_b_initiator_socket', 'uvm/uvm_tlm_generic_payload'],
  ['uvm_run_phase', 'uvm/uvm_phase'],
  ['uvm_reset_phase', 'uvm/uvm_phase'],
  ['pre_reset_phase', 'uvm/reset_phase'],
  ['post_main_phase', 'uvm/main_phase'],
  ['run_phase', 'uvm/run_phase'],
  ['UVM_PHASE_EXECUTING', 'uvm/uvm_phase_state'],
  ['UVM_PHASE_TRACE', 'uvm/UVM_OBJECTION_TRACE'],
  ['UVM_CONFIG_DB_TRACE', 'uvm/UVM_OBJECTION_TRACE'],
  ['UVM_ACTIVE', 'uvm/UVM_ACTIVE'],
  ['UVM_ALL_ACTIVE', 'uvm/uvm_heartbeat'],
  ['UVM_NOCOMPARE', 'uvm/UVM_ALL_ON'],
  ['UVM_DEC', 'uvm/UVM_HEX'],
  ['UVM_SEQ_ARB_FIFO', 'uvm/uvm_sequencer_arb_mode'],
  ['SEQ_ARB_STRICT_FIFO', 'uvm/uvm_sequencer_arb_mode'],
  ['UVM_LITTLE_FIFO', 'uvm/uvm_reg_map'],
  ['UVM_IS_OK', 'uvm/uvm_status_e'],
  ['UVM_BACKDOOR', 'uvm/uvm_path_e'],
  ['UVM_PREDICT_DIRECT', 'uvm/uvm_reg_predictor'],
  ['uvm_reg_bit_bash_seq', 'uvm/uvm_reg_hw_reset_seq'],
  ['uvm_mem_walk_seq', 'uvm/uvm_reg_hw_reset_seq'],
  ['uvm_mem_mam', 'uvm/uvm_mem'],
  ['uvm_reg_predictor', 'uvm/uvm_reg_predictor'],
  ['uvm_reg_file', 'uvm/uvm_reg'],
  ['uvm_hdl_force', 'uvm/uvm_hdl_read'],
  ['uvm_report_error', 'uvm/uvm_report_info'],
  ['uvm_report_server', 'uvm/uvm_report_server'],
  ['set_report_id_action_hier', 'uvm/set_report_verbosity_level'],
  ['set_type_override_by_type', 'uvm/set_type_override'],
  ['set_inst_override_by_name', 'uvm/set_inst_override'],
  ['uvm_table_printer', 'uvm/uvm_printer'],
  ['uvm_resource_pool', 'uvm/uvm_resource_db'],
  ['uvm_resource_db', 'uvm/uvm_resource_db'],
  ['post_body', 'uvm/pre_body'],
  ['ungrab', 'uvm/grab'],
  ['type_id', 'uvm/type_id'],
  ['seq_item_port', 'uvm/seq_item_port'],
  ['rsp_export', 'uvm/rsp_port'],
  ['UVM_INFO', 'uvm/UVM_INFO_severity'],
  ['UVM_ERROR', 'uvm/UVM_ERROR_severity'],
  ['UVM_FATAL', 'uvm/UVM_FATAL_severity'],
  ['UVM_WARNING', 'uvm/UVM_WARNING_severity'],
  ['UVM_VERBOSITY', 'uvm/UVM_VERBOSITY_option'],
  ['`uvm_info', 'uvm/uvm_info'],
  ['`uvm_error', 'uvm/uvm_error'],
  ['uvm_verbosity', 'uvm/uvm_verbosity'],
  ['data1_reg', undefined],
  ['uvm_not_a_real_name', undefined],
  ['write', undefined],
  ['set', undefined],
];

let failed = 0;
for (const [word, want] of cases) {
  const got = lookup.resolve(dirs, word);
  const rel = got && path.relative(library, got).replace(/\.md$/, '').split(path.sep).join('/');
  if (rel !== want) {
    failed++;
    console.log(`FAIL ${word}: got ${rel}, want ${want}`);
  }
}

assert.ok(lookup.toRegExp('uvm_*_port').test('uvm_blocking_put_port'));
assert.ok(!lookup.toRegExp('uvm_*_port').test('xuvm_blocking_put_port'));
assert.ok(!lookup.toRegExp('a.b').test('axb'));

console.log(`${cases.length - failed}/${cases.length} lookups passed`);
process.exit(failed ? 1 : 0);
