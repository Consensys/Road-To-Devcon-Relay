pragma solidity >= 0.5 .0;

import "./SafeMath.sol";

contract LoanContract {

    using SafeMath
    for uint256;
    /*==============Struct Definition Section==============*/

    /**
       @dev keeps track of a loan requested by investor
       @atr ower the farmer who took out the loan agreement
       @atr dateDue the date at which the loan is due
       @atr owing the amount which is due
       @atr the interest to be paid over the borrowed amount (e.g. borrowed=100 interest=10 owing=110)
       @atr paid indicates if the loan has been paid or not
       @atr active indicates if the instance of the loan is active or not
       @atr amountOwingafter represents the amount the farmer will owe if they fail to pay within 6 months
       @atr penalised indicates if the farmer has been penalised for late payment or not
        */
    struct Loan {
        address ower;
        uint256 dateDue;
        uint256 owing;
        uint256 amountOwingafter;
        bool penalised;
        uint256 interest;
        bool paid;
        bool active;
    }
    /*==============contract variable Definition Section==============*/
    mapping(address => Loan) ApprovedLoans;
    uint256 loaninterest; //@dev in %
    uint256 loanpaymentPenalty; //@dev in %



    /*==============function Definition Section==============*/
    constructor() public {
        loaninterest = 15;
        loanpaymentPenalty = 7;
    }
    /*============Loan function Definition Section==============*/

    function checkifQaulifyLoan() public view returns(bool) {
        require(msg.sender != address(0), "Invalid sender address");
        require(!ApprovedLoans[msg.sender].active, "You currently have a pending unpaid loan");
        return true;
    }

    function applyForLoan(uint256 amount, uint256 due, uint256 amountafter) public returns(bool) {
        require(msg.sender != address(0), "Invalid sender address");
        require(due > 0, "Loan payable date must be greater than 0");
        ApprovedLoans[msg.sender].ower = msg.sender;
        ApprovedLoans[msg.sender].owing = amount;
        ApprovedLoans[msg.sender].active = false;
        ApprovedLoans[msg.sender].paid = false;
        ApprovedLoans[msg.sender].interest = loaninterest;
        ApprovedLoans[msg.sender].dateDue = due;
        ApprovedLoans[msg.sender].amountOwingafter = amountafter;
        return true;
    }

    function getInterestOWingAfterDeadLinepPercent() public view returns(uint256) {
        require(msg.sender != address(0), "Invalid sender address");
        return loanpaymentPenalty;
    }

    function payLoan(uint256 amount, uint256 todaysDate) public returns(uint256) {
        require(msg.sender != address(0), "Invalid sender address");
        require(todaysDate > 0, "Todays date has to be greater than 0");
        if (!ApprovedLoans[msg.sender].paid) {
            if (ApprovedLoans[msg.sender].dateDue < todaysDate) {
                ApprovedLoans[msg.sender].owing.sub(amount);
                if (ApprovedLoans[msg.sender].owing == 0) {
                    ApprovedLoans[msg.sender].paid = true;
                    ApprovedLoans[msg.sender].active = false;
                }
            } else if (!ApprovedLoans[msg.sender].penalised) {
                ApprovedLoans[msg.sender].owing = ApprovedLoans[msg.sender].amountOwingafter;
                ApprovedLoans[msg.sender].penalised = true;
            }
        }

        return ApprovedLoans[msg.sender].owing;
    }
}