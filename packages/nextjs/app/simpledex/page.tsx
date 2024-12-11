"use client";

import { useSimpleDex } from "./simpleDex.hooks";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";

const SimpleDEX: NextPage = () => {
  const {
    handleAddLiquidity,
    handleApproveTKA,
    handleApproveTKB,
    handleOnInputApproveTKAChange,
    handleOnInputApproveTKBChange,
    handleOnSwapTKA,
    handleOnSwapTKB,
    handleOnSwapA,
    handleOnSwapB,
    handleRemoveLiquidity,
    handleOnChangeLiquidityA,
    handleOnChangeLiquidityB,
    handleOnChangeRemoveLiquidityA,
    handleOnChangeRemoveLiquidityB,
    allowanceA,
    allowanceB,
    isLoadingAllowanceA,
    isLoadingAllowanceB,
    reserveA,
    reserveB,
    swapA,
    swapB,
    text,
    tkaApproveInput,
    tkbApproveInput,
    liquidityAInput,
    liquidityBInput,
    removeLiquidityAInput,
    removeLiquidityBInput,
  } = useSimpleDex();

  return (
    <div className="relative flex flex-col flex-1 px-4 py-2">
      <div>
        <p>Reserve A: {reserveA?.toString()}</p>
        <p>Reserve B: {reserveB?.toString()}</p>
      </div>
      <div>
        {(!allowanceA || !allowanceB) && <p>{text}</p>}
        <div className="flex flex-row justify-evenly">
          {!allowanceA && !isLoadingAllowanceA && (
            <div>
              <p>Approve TKA</p>
              <input
                type="numbers"
                placeholder="TokenA"
                className="input w-full max-w-xs"
                value={tkaApproveInput}
                onChange={handleOnInputApproveTKAChange}
              />
              <button className="btn btn-secondary mt-2" onClick={handleApproveTKA} disabled={!tkaApproveInput}>
                Approve
              </button>
            </div>
          )}
          {!allowanceB && !isLoadingAllowanceB && (
            <div>
              <p>Approve TKB</p>
              <input
                type="numbers"
                placeholder="TokenB"
                className="input w-full max-w-xs"
                value={tkbApproveInput}
                onChange={handleOnInputApproveTKBChange}
              />
              <button className="btn btn-secondary mt-2" onClick={handleApproveTKB} disabled={!tkbApproveInput}>
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
      <>
        <div className="flex flex-row justify-evenly">
          <div>
            <p>Add Liquidity TokenA</p>
            <input
              type="numbers"
              placeholder="TokenA"
              className="input w-full max-w-xs"
              value={liquidityAInput}
              onChange={handleOnChangeLiquidityA}
            />
          </div>
          <div>
            <p>Add Liquidity TokenB</p>
            <input
              type="numbers"
              placeholder="TokenB"
              className="input w-full max-w-xs"
              value={liquidityBInput}
              onChange={handleOnChangeLiquidityB}
            />
          </div>
        </div>
        <button
          className="btn btn-secondary mt-2"
          onClick={handleAddLiquidity}
          disabled={!liquidityAInput || !liquidityBInput}
        >
          Add Liquidity
        </button>
      </>
      <>
        <div className="flex flex-row justify-evenly">
          <div>
            <p>Remove Liquidity TokenA</p>
            <input
              type="numbers"
              placeholder="TokenA"
              className="input w-full max-w-xs"
              value={removeLiquidityAInput}
              onChange={handleOnChangeRemoveLiquidityA}
            />
          </div>
          <div>
            <p>Remove Liquidity TokenB</p>
            <input
              type="numbers"
              placeholder="TokenB"
              className="input w-full max-w-xs"
              value={removeLiquidityBInput}
              onChange={handleOnChangeRemoveLiquidityB}
            />
          </div>
        </div>
        <button
          className="btn btn-secondary mt-2"
          onClick={handleRemoveLiquidity}
          disabled={!removeLiquidityAInput || !removeLiquidityBInput}
        >
          Remove Liquidity
        </button>
      </>
      <div className="flex flex-row justify-evenly">
        <div>
          <p>Swap TKA-TKB</p>
          <input
            type="numbers"
            placeholder="TokenA"
            className="input w-full max-w-xs"
            value={swapA}
            onChange={handleOnSwapA}
          />
          <button className="btn btn-secondary mt-2" onClick={handleOnSwapTKA} disabled={!swapA}>
            Swap TKA-TKB
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-evenly">
        <div>
          <p>Swap TKB-TKA</p>
          <input
            type="numbers"
            placeholder="TokenA"
            className="input w-full max-w-xs"
            value={swapB}
            onChange={handleOnSwapB}
          />
          <button className="btn btn-secondary mt-2" onClick={handleOnSwapTKB} disabled={!swapB}>
            Swap TKB-TKA
          </button>
        </div>
      </div>
    </div>
  );
};
export default SimpleDEX;
