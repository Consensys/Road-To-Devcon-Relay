pragma solidity >= 0.5 .0;

import "./SafeMath.sol";
import "./ERC721.sol";

//@dev the contract is not optimised for gas 
contract Shintsha is ERC721 {
    using SafeMath
    for uint256;
    /*==============Struct Definition Section==============*/
    /*
    *@dev represents a Product stored by the contract
    @atr owner  represents the owner of the Product
    @atr index id of the product managed by the token mapping
    @atr name the name of the product
    @atr value represents the value of the Product the value in T-Tokens (see documentation)
    @ar sellingPrice the price at which the product can be sold for in T-Tokens
    @atr category representst the categories the product falls under string seperated by semicolons if product falls in more than one category
    @atr active used to check if the current instance is active or not
    @atr dateDue month at which the harvest is to be delivered by
    @atr cap the total amount in ETH required to make a commitement
    @atr investors all investors who have paid going to pay for the product
    @atr fiat all investors who are going to pay for the product
   @atr earnings the total amount earned by product thus far used to limit the amount required by farmer
   @atr canBeTraded indicates of the product can be traded or not (usefull to prevent the owner from trading a product that has investors)
    */
    struct Product {
        address owner;
        uint256 index;
        string name;
        uint256 sellingPrice;
        string category;
        uint256 dateDue;
        uint256 cap;
        uint256 earnings;
        bool active;
        address[] investors;
        address[] fiatInvestors;
        bool canBeTraded;
        address[] tradeRequestors;
    }
    /*
    *@dev represents a player that play Tshintsha
    @atr id represents the id of the Farmer 
    @atr farmName represents the name of the farm
    @atr farmAddress the address of the farm
    @atr country the country with which the organic farm in located
    @atr earnings the total amount in eth the farmer has owns
    @atr phoneNumber the RegisteredFarmers phoneNumber
    @atr registeredProductsKeys represents all keys of all registered products
    @atr soldProductsKeys represents all keys of all sold products
    @atr registeredProducts represents all the registered products by the farmer 
    @notice all traded products between RegisteredFarmers are added and removed from the registeredProducts array
    @notice Famer address are generated when a farmer registers for the services
    */
    struct Farmer {
        address id;
        string farmName;
        string farmAddress;
        string country;
        uint256 earnings;
        string phoneNumber;
        uint256[] registeredProductsKeys;
        uint256[] soldProductsKeys;
        mapping(uint256 => Product) registeredProducts;
        uint256[] boughtProductsKeys;
        mapping(uint256 => Product) boughtProducts;

        bool active;
    }
    /**
    @dev represents a potential investor
    @atr id represents the id of 
    @atr name represents the name of the investor
    @atr surname represents the surname of the investor
    @atr homeAddress represents the home address of the investor
    @atr country represents the country which the investor comes from
    @atr phoneNumber represents the phone number of the investor
    @atr boughtProductsKeys keeps track of all products bought by investor
    @atr active indicates if the instance submitted by investor is active or not
    @active represents
     */
    struct Investor {
        address id;
        string name;
        string surname;
        string homeAddress;
        string country;
        string phoneNumber;
        uint256[] boughtProductsKeys;
        bool active;
    }

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
    /*==============events Definition Section==============*/
    event emitId(uint256 tokenID);
    event emitProposalId(bytes32 referenceID);
    /*==============modifier Definition Section==============*/
    modifier onlyAdmin() {
        require(msg.sender == owner, "only owner can call this function");
        _;
    }
    /*==============contract variable Definition Section==============*/
    /*@dev maps a Product Id to its corresponding Product Item*/
    mapping(uint256 => Product) RegisteredProducts;
    mapping(address => Farmer) RegisteredFarmers;
    mapping(address => Investor) RegisteredInvestors;
    mapping(address => Loan) ApprovedLoans;
    mapping(uint256 => Product) RequestedProducts;
    uint256[] RegisteredProductsKeys;
    uint256[] RequestedProductsKeys;
    uint256 requestedProductsIndex;
    address owner;
    uint256 currentIndexProducts; //@dev used to index each product in the token mapping
    uint256 private totalEarned;
    uint256 public requiredMinProductsForLoan;
    uint256 public contractcutPercent;
    uint256 public loaninterest; //@dev in %
    /*==============function Definition Section==============*/
    constructor() public {
        currentIndexProducts = 0;
        owner = msg.sender;
        totalEarned = 0;
        requestedProductsIndex = 0;
        requiredMinProductsForLoan = 3;
        contractcutPercent = 10;
        loaninterest = 15;
    }
    /*==============Farmer functions Definition Section==============*/

    function registerFarmer(string memory farmname, string memory farmAddress, string memory country, string memory phoneNumber) public returns(bool) {
        require(msg.sender != address(0), "Invalid sender address");
        require(!RegisteredFarmers[msg.sender].active, "farmer already registered");
        RegisteredFarmers[msg.sender].active = true;
        RegisteredFarmers[msg.sender].farmName = farmname;
        RegisteredFarmers[msg.sender].country = country;
        RegisteredFarmers[msg.sender].phoneNumber = phoneNumber;
        RegisteredFarmers[msg.sender].farmAddress = farmAddress;
        RegisteredFarmers[msg.sender].id = msg.sender;
        return RegisteredFarmers[msg.sender].active;
    }

    function checkfarmerExist() public view returns(bool) {
        require(msg.sender != address(0), "Invalid sender address");
        return RegisteredFarmers[msg.sender].active;
    }

    function registerProduct(string memory categories, uint256 sellingprice, string memory name, uint256 endHarvest, uint256 cap) public returns(bool) {
        require(msg.sender != address(0), "Invalid sender address");
        require(RegisteredFarmers[msg.sender].active, "farmer not registered");
        require(sellingprice > 0, "selling price is required to be greater than 0");
        require(endHarvest > 0, "Invalid harvest end date");
        RegisteredProducts[currentIndexProducts].canBeTraded = true;
        RegisteredProducts[currentIndexProducts].owner = msg.sender;
        RegisteredProducts[currentIndexProducts].index = currentIndexProducts;
        RegisteredProducts[currentIndexProducts].category = categories;
        RegisteredProducts[currentIndexProducts].active = true;
        RegisteredProducts[currentIndexProducts].name = name;
        RegisteredProducts[currentIndexProducts].sellingPrice = sellingprice;
        RegisteredProducts[currentIndexProducts].dateDue = endHarvest;
        RegisteredProducts[currentIndexProducts].cap = cap;
        RegisteredProducts[currentIndexProducts].earnings = 0;
        RegisteredFarmers[msg.sender].registeredProducts[currentIndexProducts] = RegisteredProducts[currentIndexProducts];
        RegisteredFarmers[msg.sender].registeredProductsKeys.push(currentIndexProducts);
        RegisteredProductsKeys.push(currentIndexProducts);
        _mint(msg.sender, currentIndexProducts);
        currentIndexProducts = currentIndexProducts.add(1);
        return true;
    }

    function getRegisteredProductsKeys() public view returns(uint256[] memory) {
        require(msg.sender != address(0), "Invalid sender address");
        return RegisteredProductsKeys;
    }

    function getFarmerRegisteredProductKeys() public view returns(uint256[] memory) {
        require(msg.sender != address(0), "Invalid sender address");
        require(RegisteredFarmers[msg.sender].active, "Famer not registered");
        return RegisteredFarmers[msg.sender].registeredProductsKeys;
    }

    function productExists(uint256 id) public view returns(bool) {
        require(msg.sender != address(0), "Invalid sender address");
        require(id >= 0, "product id must be equal to and greater than 0");
        return RegisteredProducts[id].active;
    }

    function getTotalSupply() public view returns(uint256) {
        require(msg.sender != address(0));
        return currentIndexProducts;
    }

    function requestTrade(address productOwner, uint256 productId) public returns(bool) {
        require(msg.sender != address(0), "Invalid sender address");
        require(RegisteredFarmers[msg.sender].active || RegisteredInvestors[msg.sender].active, "You currently not registered");
        require(RegisteredFarmers[productOwner].active, "product owner is not registered");
        require(RegisteredFarmers[productOwner].registeredProducts[productId].owner != msg.sender, "cannot request for trade on a product you already own");
        require(RegisteredFarmers[productOwner].registeredProducts[productId].active, "product no longer exists");
        RegisteredFarmers[productOwner].registeredProducts[productId].tradeRequestors.push(msg.sender);
        return true;
    }

    function tradeProduct(address to, uint256 productId) public returns(bool) {
        require(msg.sender != address(0), "Invalid sender address");
        require(to != address(0), "invalid trader destination address");
        require(RegisteredFarmers[msg.sender].active, "farmer not registered");
        require(RegisteredFarmers[to].active, "farmer to not  not registered");
        require(productId >= 0, "product id must be equal to and greater than 0");
        require(ownerOf(productId) == msg.sender, "You cannot trade a product you currently dont own");
        require(ownerOf(productId) != to, "You cannot trade a product to yourself");
        require(RegisteredProducts[productId].canBeTraded, "Product cant be traded");
        transferFrom(msg.sender, to, productId);
        RegisteredProducts[productId].owner = to;
        RegisteredFarmers[to].registeredProductsKeys.push(productId);
        RegisteredFarmers[to].registeredProducts[productId] = RegisteredFarmers[msg.sender].registeredProducts[productId];
        delete RegisteredFarmers[msg.sender].registeredProducts[productId];
        delete RegisteredFarmers[msg.sender].registeredProductsKeys[productId];
        return true;
    }

    function checkifProductCapNotReached(address productOwner, uint256 productId) public view returns(bool) {
        require(msg.sender != address(0), "Invalid sender address");
        require(_exists(productId), "Product doesnt exists");
        require(RegisteredFarmers[msg.sender].active || RegisteredInvestors[msg.sender].active, "You currently not registered");
        return RegisteredProducts[productId].active && RegisteredFarmers[productOwner].registeredProducts[productId].cap >= RegisteredFarmers[productOwner].registeredProducts[productId].earnings;
    }

    function buyProduct(address productOwner, uint256 productId, bool isfiat) public payable returns(bool) {
        require(msg.sender != address(0), "Invalid sender address");
        require(productOwner != address(0), "Invalid trader destination address");
        require(RegisteredFarmers[msg.sender].active || RegisteredInvestors[msg.sender].active, "You currently not registered");
        require(RegisteredProducts[productId].active, "Product already sold or does not exits");
        require(productOwner != msg.sender, "Cannot buy a product from your self");
        require(RegisteredFarmers[productOwner].active, "Product seller not  not registered");
        require(productId >= 0, "Product Id must be equal to and greater than 0");
        require(msg.value > 0, "Contract cut has to be greater than 0 Eth");
        totalEarned = totalEarned.add(msg.value);
        RegisteredFarmers[productOwner].registeredProducts[productId].canBeTraded = false;
        if (RegisteredFarmers[msg.sender].active) {
            RegisteredFarmers[productOwner].registeredProducts[productId].earnings = RegisteredFarmers[productOwner].registeredProducts[productId].earnings.add(RegisteredFarmers[productOwner].registeredProducts[productId].sellingPrice.sub(msg.value));
            RegisteredFarmers[msg.sender].boughtProducts[productId] = RegisteredFarmers[productOwner].registeredProducts[productId];
            RegisteredFarmers[msg.sender].boughtProductsKeys.push(productId);
            if (isfiat) {
                RegisteredFarmers[productOwner].registeredProducts[productId].fiatInvestors.push(msg.sender);
            } else {
                RegisteredFarmers[productOwner].registeredProducts[productId].investors.push(msg.sender);
            }
        } else {
            if (isfiat) {
                RegisteredFarmers[productOwner].registeredProducts[productId].fiatInvestors.push(msg.sender);
            } else {
                RegisteredFarmers[productOwner].registeredProducts[productId].investors.push(msg.sender);
            }
            RegisteredInvestors[msg.sender].boughtProductsKeys.push(productId);
        }
        return true;
    }

    function getProduct(uint256 productId) public view returns(string memory name, uint256 sellingPrice, string memory category, uint256 dueDate, address productowner, uint256 earnings, uint256 capital) {
        require(msg.sender != address(0), "Invalid sender address");
        require(productId >= 0, "Invalid product Id");
        require(_exists(productId), "Product does not exist");
        name = RegisteredProducts[productId].name;
        sellingPrice = RegisteredProducts[productId].sellingPrice;
        category = RegisteredProducts[productId].category;
        dueDate = RegisteredProducts[productId].dateDue;
        productowner = RegisteredProducts[productId].owner;
        earnings = RegisteredProducts[productId].earnings;
        capital = RegisteredProducts[productId].cap;
    }

    function getFarmerProducts(uint256 productId) public view returns(string memory name, uint256 sellingPrice, string memory category, uint256 dueDate) {
        require(msg.sender != address(0), "Invalid sender address");
        require(RegisteredFarmers[msg.sender].active, "You currently not registered");
        require(productId >= 0, "Invalid product Id");
        require(_exists(productId), "Product does not exist");
        name = RegisteredProducts[productId].name;
        sellingPrice = RegisteredProducts[productId].sellingPrice;
        category = RegisteredProducts[productId].category;
        dueDate = RegisteredProducts[productId].dateDue;
    }

    function getFarmer(address farmer) public view returns(string memory farmName, string memory farmAddress, string memory country, string memory phoneNumber, uint256 totalRegistered) {
        require(msg.sender != address(0), "Invalid sender address");
        require(farmer != address(0), "Invalid farmer address");
        require(RegisteredFarmers[farmer].active, "Farmer not registered");
        farmName = RegisteredFarmers[farmer].farmName;
        farmAddress = RegisteredFarmers[farmer].farmAddress;
        country = RegisteredFarmers[farmer].country;
        phoneNumber = RegisteredFarmers[farmer].phoneNumber;
        totalRegistered = RegisteredFarmers[farmer].registeredProductsKeys.length;
    }

    function getFarmProductInvestorKeys(uint256 productId) public view returns(address[] memory, uint256,string memory) {
        require(msg.sender != address(0), "Invalid sender address");
        require(RegisteredFarmers[msg.sender].active, "You are currently not registered as a farmer");
        require(_exists(productId), "Product doesnt exists");
        require(ownerOf(productId) == msg.sender, "You cannot get product investor keys for a product you dont own");
        return (RegisteredFarmers[msg.sender].registeredProducts[productId].investors, RegisteredFarmers[msg.sender].registeredProducts[productId].earnings,RegisteredFarmers[msg.sender].registeredProducts[productId].name);
    }

    function getFarmProductFiatInvestorKeys(uint256 productId) public view returns(address[] memory) {
        require(msg.sender != address(0), "Invalid sender address");
        require(RegisteredFarmers[msg.sender].active, "You are currently not registered as a farmer");
        require(_exists(productId), "Product doesnt exists");
        require(ownerOf(productId) == msg.sender, "You cannot get product investor keys for a product you dont own");
        return RegisteredFarmers[msg.sender].registeredProducts[productId].fiatInvestors;
    }

    function getFarmerProductKeys() public view returns(uint256[] memory) {
        return RegisteredFarmers[msg.sender].registeredProductsKeys;
    }

    function requestProduct(string memory name, string memory categories, uint256 expected) public returns(bool) {
        require(msg.sender != address(0), "Invalid sender address");
        require(RegisteredFarmers[msg.sender].active || RegisteredInvestors[msg.sender].active, "You currently not registered not registered");
        require(expected > 0, "Invalid expected date");
        RequestedProducts[requestedProductsIndex].name = name;
        RequestedProducts[requestedProductsIndex].category = categories;
        RequestedProducts[requestedProductsIndex].dateDue = expected;
        RequestedProducts[requestedProductsIndex].category = categories;
        RequestedProductsKeys.push(requestedProductsIndex);
        requestedProductsIndex = requestedProductsIndex.add(1);
        return true;
    }

    function getRequestedProductKeys() public view returns(uint256[] memory) {
        require(msg.sender != address(0), "Invalid sender address");
        require(RegisteredFarmers[msg.sender].active || RegisteredInvestors[msg.sender].active, "You currently not registered");
        return RequestedProductsKeys;
    }

    function commitToHarvesting(uint256 productId) public returns(bool) {
        require(msg.sender != address(0), "Invalid sender address");
        require(RegisteredFarmers[msg.sender].active, "Only Registered farmers are allowed to make harvest commitments");
        require(!RequestedProducts[productId].active, "product already has a farmer commited to producing the harvest");
        RequestedProducts[productId].owner = msg.sender;
        RequestedProducts[productId].active = true;
        return true;
    }
    /*==============Investors functions Definition Section==============*/
    function registerInvestor(string memory name, string memory surname, string memory homeAddress, string memory country, string memory phoneNumber) public returns(bool) {
        require(msg.sender != address(0), "Invalid sender address");
        require(!RegisteredInvestors[msg.sender].active, "Investor already registered");
        RegisteredInvestors[msg.sender].active = true;
        RegisteredInvestors[msg.sender].name = name;
        RegisteredInvestors[msg.sender].surname = surname;
        RegisteredInvestors[msg.sender].homeAddress = homeAddress;
        RegisteredInvestors[msg.sender].phoneNumber = phoneNumber;
        RegisteredInvestors[msg.sender].country = country;
        return true;
    }

    /*============Loan function Definition Section==============*/
    function checkifQaulifyLoan() public view returns(bool) {
        require(msg.sender != address(0), "Invalid sender address");
        require(RegisteredFarmers[msg.sender].active, "You currently not registered");
        require(!ApprovedLoans[msg.sender].active, "You currently have a pending unpaid loan");
        return RegisteredFarmers[msg.sender].registeredProductsKeys.length >= requiredMinProductsForLoan && msg.sender != owner;
    }

    function applyForLoan(uint256 amount, uint256 due, uint256 amountafter) public returns(bool) {
        require(msg.sender != address(0), "Invalid sender address");
        require(RegisteredFarmers[msg.sender].active, "You currently not registered");
        require(due > 0, "Loan payable date must be greater than 0");
        require(msg.sender != owner, "Owner not allowed to take out loans");
        require(checkifQaulifyLoan(), "You currently have a pending loan or do not qaulify for a loan");
        ApprovedLoans[msg.sender].ower = msg.sender;
        ApprovedLoans[msg.sender].owing = amount;
        ApprovedLoans[msg.sender].active = true;
        ApprovedLoans[msg.sender].paid = false;
        ApprovedLoans[msg.sender].interest = loaninterest;
        ApprovedLoans[msg.sender].dateDue = due;
        ApprovedLoans[msg.sender].amountOwingafter = amountafter;
        return true;
    }

    function payLoan() public payable returns(uint256) {
        require(msg.sender != address(0), "Invalid sender address");
        require(RegisteredFarmers[msg.sender].active, "You currently not registered");
        require(ApprovedLoans[msg.sender].active, "You currently dont have any outstanding loan/s");
        require(msg.value > 0, 'loan payment must be greater than 0');
        if (!ApprovedLoans[msg.sender].paid) {
            if (ApprovedLoans[msg.sender].dateDue < now) {
                if (ApprovedLoans[msg.sender].owing < msg.value) {
                    ApprovedLoans[msg.sender].owing = 0;
                } else {
                    ApprovedLoans[msg.sender].owing = ApprovedLoans[msg.sender].owing.sub(msg.value);
                }
                if (ApprovedLoans[msg.sender].owing == 0) {
                    ApprovedLoans[msg.sender].paid = true;
                    ApprovedLoans[msg.sender].active = false;
                }
                return ApprovedLoans[msg.sender].owing;
            } else if (!ApprovedLoans[msg.sender].penalised) {
                ApprovedLoans[msg.sender].owing = ApprovedLoans[msg.sender].owing.add(ApprovedLoans[msg.sender].amountOwingafter);
                ApprovedLoans[msg.sender].penalised = true;
            }
        }
        ApprovedLoans[msg.sender].owing = ApprovedLoans[msg.sender].owing.sub(msg.value);
        return ApprovedLoans[msg.sender].owing;
    }

    function getLoanAmountOwing() public view returns(uint256) {
        return ApprovedLoans[msg.sender].owing;
    }
    /*============Admin function Definition Section==============*/

    function getTotalEarned() onlyAdmin public view returns(uint256) {
        require(msg.sender != address(0), "Invalid admin address");
        return totalEarned;
    }
    /*
        function updateloanpaymentPenalty(uint256 percent) onlyAdmin public returns(bool) {
            require(msg.sender != address(0), "Invalid admin address");
            require(percent > 0, "New loan panalty must be greater than 0");
            loanpaymentPenalty = percent;
        }
       function updaterequiredMinProductsForLoan(uint256 amount) onlyAdmin public returns(bool) {
            require(msg.sender != address(0), "Invalid admin address");
            require(amount > 0, "New contract minimum product required must be greater than 0");
            requiredMinProductsForLoan = amount;
        }  
         function updateloaninterest(uint256 percent) onlyAdmin public returns(bool) {
            require(msg.sender != address(0), "Invalid admin address");
            require(percent > 0, "New loan interest must be greater than 0");
            loaninterest = percent;
        }
       
    function updatecontractcutPercent(uint256 percent) onlyAdmin public returns(bool) {
        require(msg.sender != address(0), "Invalid admin address");
        require(percent > 0, "New contract cut Percent must be greater than 0");
        contractcutPercent = percent;
    }

*/



}