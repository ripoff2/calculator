import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Calculator } from "../target/types/calculator";
const { SystemProgram } = anchor.web3;
import { expect } from "chai";

describe("calculator", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Calculator as Program<Calculator>;
  const programProvider = program.provider as anchor.AnchorProvider;

  const calculatorPair = anchor.web3.Keypair.generate();

  const text = "SomeText";

  it("Should create an instanse", async () => {
    await program.methods.create(text).accounts(
      {
        calculator: calculatorPair.publicKey,
        user: programProvider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }
    ).signers([calculatorPair]).rpc()

    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.greeting).to.eql(text)
  });

  it("Should add", async () => {
    await program.methods.add(new anchor.BN(2), new anchor.BN(3))
    .accounts({
      calculator: calculatorPair.publicKey,
    })
    .rpc()

    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(5))
  });

  it("Should sub", async () => {
    await program.methods.sub(new anchor.BN(10), new anchor.BN(5))
    .accounts({
      calculator: calculatorPair.publicKey,
    })
    .rpc()
    
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(5))
  });

  it("Should mul", async () => {
    await program.methods.mul(new anchor.BN(10), new anchor.BN(5))
    .accounts({
      calculator: calculatorPair.publicKey,
    })
    .rpc()
    
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(50))
  });


  it("Should div", async () => {
    await program.methods.div(new anchor.BN(10), new anchor.BN(5))
    .accounts({
      calculator: calculatorPair.publicKey,
    })
    .rpc()
    
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(2))
  });

  it("Should not div by zero", async () => {
    const options = {
      skipPreflight: true,
    }
    try {
      await program.methods.div(new anchor.BN(10), new anchor.BN(0))
      .accounts({
        calculator: calculatorPair.publicKey,
      })
      .rpc(options)
    } catch(err) {
      expect(err).to.be.instanceOf(Error)
    }
  });

});
