pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Micronews is Ownable {
    using SafeMath for uint256;

    struct Channel {
        uint256 id;
        uint256 subscribers;
        bytes name;
    }

    uint256 CHANNEL_SUBSCRIPTION_FEE = 0.1 ether;
    uint256 CHANNEL_INITIATION_FEE = 0.2 ether;

    uint256 constant WEEK_IN_SECONDS = 86400 * 7;
    uint256 constant MAX_BOOKMARKS_PER_PERIOD = 5;

    mapping(uint256 => Channel) channels;

    mapping(uint256 => uint256) channelIdToTotalEquity;
    /* channelId => total tokens */

    mapping(uint256 => mapping(address => uint256)) channelIdToUserEquity;
    /* channelId => user => tokens owned */

    mapping(uint256 => mapping(uint256 => mapping(address => bool))) channelIdToUserSubscriptionStatus;
    /* feePeriodId => channelId => user => subscriptionStatusBool */

    mapping(uint256 => mapping(address => uint256)) userBookmarksPerPeriod;
    mapping(uint256 => mapping(address => uint256)) receivedBookmarksPerPeriod;
    /* feePeriodId => user => number of bookmarks */

    uint256 public channelId = 1;
    uint256 public RESERVE_RATIO = 500000; // 500k / 1 million = 50%

    uint256 public creatorId = 1;
    mapping(address => uint256) creatorAddressToId;
    mapping(uint256 => bytes) creatorIdToName;

    uint256 public postId = 1;
    mapping(uint256 => Post) public posts;
    mapping(uint256 => mapping(uint256 => uint256[])) channelPostsByFeePeriod;
    /* feePeriodId => channelId => posts */

    mapping(address => mapping(uint256 => uint256[])) creatorToPostsByFeePeriod;

    mapping(address => uint256) creatorToLastPosted;
    uint256 public TIME_BETWEEN_POSTS = 12 hours;

    uint256 genesisTimestamp;

    constructor() public {
        genesisTimestamp = block.timestamp;
    }

    struct Post {
        uint256 id;
        uint256 channelId;
        uint256 feePeriodId;
        uint256 timestamp;
        uint256 upvotes;
        uint256 downvotes;
        string content;
        address creator;
    }

    /* Fee period id is universal but contract calculates distribution by channel */
    struct FeePeriod {
        uint256 id;
        uint256 channelId;
        uint256 valueForEquityDistribution;
        uint256 valueForCreatorDistribution;
    }

    uint256 currentFeePeriod = 1;

    mapping(uint256 => mapping(uint256 => FeePeriod)) feePeriods;
    /* feePeriodId => channelId => FeePeriod */

    mapping(uint256 => mapping(uint256 => mapping(address => bool))) periodFeesCollected;
    /* feePeriodId => channelId => owner address => boolean */

    event PostCreated(
        address indexed creator,
        uint256 indexed channelId,
        string content
    );

    /* ------ BONDING CURVE FUNCTIONS ------ */

    /* 
      @dev call bonded curve mint function and register channel equity ownership
      @param _channelId to call channel CBT contract
     */

    /* Bonding curve mint tokens */
    /*    function mintEquity(uint256 _channelId) public payable {
        require(msg.value > 0, "Must transfer funds to mint equity");
         
          uint256 amount = channelIdToContract[_channelId].mint.value(
            msg.value
        )();  
       

        channelIdToTotalEquity[_channelId] = channelIdToTotalEquity[_channelId]
            .add(amount);
        channelIdToUserEquity[_channelId][msg
            .sender] = channelIdToUserEquity[_channelId][msg.sender].add(
            amount
        );
    } */

    /* 
      @dev call bonded curve burn function and register decrease in channel equity ownership
      @param _channelId to call channel CBT contract
      @param _burnAmount equity to sell
     */

    /* Bonding curve burn token */
    /*   function burnEquity(uint256 _channelId, uint256 _burnAmount) public {
        channelIdToContract[_channelId].burn(_burnAmount);

        channelIdToTotalEquity[_channelId] = channelIdToTotalEquity[_channelId]
            .sub(_burnAmount);

        channelIdToUserEquity[_channelId][msg
            .sender] = channelIdToUserEquity[_channelId][msg.sender].sub(
            _burnAmount
        );
    } */

    /* ------ SUBSCRIPTION FUNCTIONS ------ */

    /* 
        @dev user subscribes for each fee period
        @param _channelId
     */
    function subscribeToChannel(uint256 _channelId) public payable {
        require(
            msg.value == CHANNEL_SUBSCRIPTION_FEE,
            "Must pay exact fee to subscribe"
        );
        channelIdToUserSubscriptionStatus[currentFeePeriod][_channelId][msg
            .sender] = true;
    }

    /* 
        @dev user unsubscribes and loses access at end of fee period
        @param _channelId
     */
    function unsubscribeToChannel(uint256 _channelId) public {
        channelIdToUserSubscriptionStatus[currentFeePeriod][_channelId][msg
            .sender] = false;
    }

    function isUserSubscribedToChannel(uint256 _channelId)
        public
        returns (bool)
    {
        return
            channelIdToUserSubscriptionStatus[currentFeePeriod][_channelId][msg
                .sender];
    }

    /* ------ CONTENT FUNCTIONS ------ */

    /* 
        @dev deploys new CBT contract, one per content channel
        @param _channelName
     */
    function createChannel(bytes memory _channelName) public {
        Channel memory newChannel = Channel({
            id: channelId,
            subscribers: 0,
            name: _channelName
        });

        channels[channelId++] = newChannel;
    }

    /* 
        @dev content creators must register to begin building reputation
        @param _creatorName
     */
    function registerContentCreator(bytes memory _creatorName) public {
        require(creatorAddressToId[msg.sender] == 0, "Creator already exists");
        creatorAddressToId[msg.sender] = creatorId;
        creatorIdToName[creatorId] = _creatorName;
    }

    /* 
        @dev creators posting content
        @param _content
        @param _channelId
     */
    function createPost(string memory _content, uint256 _channelId) public {
        require(creatorAddressToId[msg.sender] > 0, "Creator not registered");
        require(
            creatorToLastPosted[msg.sender] + TIME_BETWEEN_POSTS <
                block.timestamp,
            "Creator must wait 12 hours between posts"
        );
        require(
            channelIdToUserSubscriptionStatus[currentFeePeriod][_channelId][msg
                .sender] ==
                true,
            "Creator not subscribed to channel"
        );

        Post memory newPost = Post({
            id: postId,
            channelId: _channelId,
            feePeriodId: currentFeePeriod,
            timestamp: block.timestamp,
            upvotes: 0,
            downvotes: 0,
            content: _content,
            creator: msg.sender
        });

        emit PostCreated(msg.sender, _channelId, _content);

        posts[postId] = newPost;
        channelPostsByFeePeriod[currentFeePeriod][_channelId].push(postId);
        creatorToPostsByFeePeriod[msg.sender][currentFeePeriod].push(postId++);
    }

    /* ------ VOTING FUNCTIONS ------ */

    modifier isEquityOwner(uint256 _channelId) {
        require(
            channelIdToUserEquity[_channelId][msg.sender] > 0,
            "Voter isn't an equity owner"
        );
        _;
    }

    /* 
        @dev only equity owners in channel are capable of voting
        @param _channelId
        @param _postId
        @param upvote boolean
     */
    function voteOnPost(uint256 _channelId, uint256 _postId, bool upvote)
        public
        isEquityOwner(_channelId)
    {
        if (upvote) {
            posts[_postId].upvotes++;
        } else {
            posts[_postId].downvotes++;
        }
    }

    /* 
        @dev content consumers are endowed with five bookmarks per fee period
            bookmarks dictate half of the content creators payout
        @param _channelId
        @param _postId
        @param upvote boolean
     */
    function bookmarkPost(uint256 _postId, uint256 _channelId) public {
        require(
            posts[_postId].feePeriodId == currentFeePeriod,
            "Bookmarks are only valid for posts in current fee period"
        );
        require(
            userBookmarksPerPeriod[currentFeePeriod][msg.sender] <
                MAX_BOOKMARKS_PER_PERIOD,
            "User has no bookmarks remaining"
        );
        require(
            channelIdToUserSubscriptionStatus[currentFeePeriod][_channelId][msg
                .sender] ==
                true,
            "Bookmarker must be subscribed to channel"
        );

        userBookmarksPerPeriod[currentFeePeriod][msg.sender]++;

        address postCreator = posts[_postId].creator;
        receivedBookmarksPerPeriod[currentFeePeriod][postCreator]++;
    }

    /* ------ FEE PERIOD FUNCTIONS ------ */

    function closeFeePeriod() public onlyOwner {
        require(
            genesisTimestamp + currentFeePeriod.mul(WEEK_IN_SECONDS) >
                block.timestamp,
            "Fee period not yet complete"
        );

        for (uint256 i = 0; i < getNumberOfChannels(); i++) {
            uint256 fee = (channels[i].subscribers)
                .mul(CHANNEL_SUBSCRIPTION_FEE)
                .div(2);

            feePeriods[currentFeePeriod][i].valueForEquityDistribution = fee;
            feePeriods[currentFeePeriod][i].valueForCreatorDistribution = fee;
        }

        currentFeePeriod++;
    }

    function collectEquityFees(uint256 _channelId)
        public
        isEquityOwner(_channelId)
    {
        uint256 equityOwnership = channelIdToUserEquity[_channelId][msg.sender];
        uint256 totalEquity = channelIdToTotalEquity[_channelId];

        uint256 payout = (equityOwnership *
            (
                feePeriods[currentFeePeriod - 1][_channelId]
                    .valueForEquityDistribution
            )) /
            totalEquity;

        periodFeesCollected[currentFeePeriod - 1][_channelId][msg
            .sender] = true;

        msg.sender.transfer(payout);
    }

    function collectContentFees(uint256 _channelId) public {
        // define isContentCreator
    }

    /* ------ GETTER FUNCTIONS ------ */

    function getNumberOfChannels() public view returns (uint256 _num) {
        return channelId - 1;
    }

    function getNumberOfPosts(uint256 _feePeriodId, uint256 _channelId)
        public
        view
        returns (uint256 _num)
    {
        channelPostsByFeePeriod[_feePeriodId][_channelId].length;
    }

    function getPostById(uint256 _postId)
        public
        view
        returns (
            uint256 _timestamp,
            uint256 _upvotes,
            uint256 _downvotes,
            string memory _content,
            address _creator
        )
    {
        return (
            posts[_postId].timestamp,
            posts[_postId].upvotes,
            posts[_postId].downvotes,
            posts[_postId].content,
            posts[_postId].creator
        );
    }
}
