// SPDX-License-Identifier: MIT
pragma solidity >0.7.0 <0.9.0;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleDEX is Ownable {
    IERC20 public tokenA;
    IERC20 public tokenB;

    uint256 public reserveA;
    uint256 public reserveB;

    event LiquidityAdded(
        address indexed provider,
        uint256 amountA,
        uint256 amountB
    );
    event LiquidityRemoved(
        address indexed provider,
        uint256 amountA,
        uint256 amountB
    );

    event TokensSwapped(
        address indexed swapAddress,
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 amountOut
    );

    event PriceUpdated(address indexed token, uint256 price);

    constructor(address _initialOwner, address _tokenA, address _tokenB) Ownable(_initialOwner) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        
    }

    modifier greaterThanZero(uint256 _amount) {
        require(_amount > 0, "Amount must be greater than zero");
        _;
    }

    modifier liquidityCheck(uint256 _amountA, uint256 _amountB) {
        require(
            _amountA <= reserveA && _amountB <= reserveB,
            "Insufficient liquidity"
        );
        _;
    }

    function addLiquidity(uint256 _amountA, uint256 _amountB)
        external
        onlyOwner
        greaterThanZero(_amountA)
        greaterThanZero(_amountB)
    {
        reserveA += _amountA;
        reserveB += _amountB;
        tokenA.transferFrom(msg.sender, address(this), _amountA);
        tokenB.transferFrom(msg.sender, address(this), _amountB);
        emit LiquidityAdded(msg.sender, _amountA, _amountB);
    }

    function swapAforB(uint256 _amountAIn)
        external
        greaterThanZero(_amountAIn)
    {
        uint256 amountBOut = getAmountOut(_amountAIn, reserveA, reserveB);

        tokenA.transferFrom(msg.sender, address(this), _amountAIn);
        tokenB.transfer(msg.sender, amountBOut);

        reserveA += _amountAIn;
        reserveB -= amountBOut;

        emit TokensSwapped(
            msg.sender,
            address(tokenA),
            _amountAIn,
            address(tokenB),
            amountBOut
        );
    }

    function swapBforA(uint256 _amountBIn)
        external
        greaterThanZero(_amountBIn)
    {
        uint256 amountAOut = getAmountOut(_amountBIn, reserveB, reserveA);

        tokenB.transferFrom(msg.sender, address(this), _amountBIn);
        tokenA.transfer(msg.sender, amountAOut);

        reserveB += _amountBIn;
        reserveA -= amountAOut;

        emit TokensSwapped(
            msg.sender,
            address(tokenB),
            _amountBIn,
            address(tokenA),
            amountAOut
        );
    }

    function removeLiquidity(uint256 _amountA, uint256 _amountB)
        external
        onlyOwner
        greaterThanZero(_amountA)
        greaterThanZero(_amountB)
        liquidityCheck(_amountA, _amountB)
    {
        reserveA -= _amountA;
        reserveB -= _amountB;
        tokenA.transfer(msg.sender, _amountA);
        tokenB.transfer(msg.sender, _amountB);
        emit LiquidityRemoved(msg.sender, _amountA, _amountB);
    }

    function getPrice(address _token) external returns (uint256) {
        uint256 _price;
        require(
            _token == address(tokenA) || _token == address(tokenB),
            "Invalid token address"
        );

        if (_token == address(tokenA)) {
            require(reserveA > 0, "No reserves for TokenA");
            _price = (reserveB * 1e18) / reserveA; // Price of 1 TokenA in terms of TokenB
        } else {
            require(reserveB > 0, "No reserves for TokenB");
            _price = (reserveA * 1e18) / reserveB; // Price of 1 TokenB in terms of TokenA
        }
        emit PriceUpdated(_token, _price);
        return _price;
    }

    function getAmountOut(
        uint256 _amountIn,
        uint256 _reserveIn,
        uint256 _reserveOut
    ) internal pure returns (uint256) {
        uint256 _amountInWithFee = _amountIn * 997;
        uint256 _num = _amountInWithFee * _reserveOut;
        uint256 _denom = (_reserveIn * 1000) + _amountInWithFee;
        return _num / _denom;
    }
}