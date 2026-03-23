#![cfg(test)]
use super::*;
use soroban_sdk::{Env, Symbol};

#[test]
fn test_verify() {
    let env = Env::default();
    let contract_id = env.register_contract(None, LieDetector);
    let client = LieDetectorClient::new(&env, &contract_id);

    let truth = Symbol::new(&env, "truth");
    let lie = Symbol::new(&env, "lie");

    assert!(client.verify(&truth));
    assert!(!client.verify(&lie));
}
