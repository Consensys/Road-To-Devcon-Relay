export default {
	address: '0x7Fc1720bd94a418e590bfAb53e18eC32d3721BA6',
	abi: [
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "teamName",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "anchor",
          "type": "address"
        }
      ],
      "name": "addAnchor",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "teamName",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "headline",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "url",
          "type": "string"
        },
        {
          "internalType": "bytes32[]",
          "name": "tags",
          "type": "bytes32[]"
        }
      ],
      "name": "createNewsStory",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "teamName",
          "type": "string"
        },
        {
          "internalType": "address[]",
          "name": "anchorList",
          "type": "address[]"
        }
      ],
      "name": "createNewsTeam",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "kill",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "_teamName",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_creator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_timestamp",
          "type": "uint256"
        }
      ],
      "name": "OnCreateNewsTeam",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "_teamName",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_anchor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_sponsor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_timestamp",
          "type": "uint256"
        }
      ],
      "name": "OnNewAnchor",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "_teamName",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_anchor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_headline",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_url",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "bytes32[]",
          "name": "_tags",
          "type": "bytes32[]"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_timestamp",
          "type": "uint256"
        }
      ],
      "name": "OnCreateNewsStory",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "_teamName",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "_tag",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_anchor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_headline",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_url",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "bytes32[]",
          "name": "_tags",
          "type": "bytes32[]"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_timestamp",
          "type": "uint256"
        }
      ],
      "name": "OnCreateNewsTopic",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "anchor",
          "type": "address"
        }
      ],
      "name": "getTeams",
      "outputs": [
        {
          "internalType": "bytes32[]",
          "name": "",
          "type": "bytes32[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "teamName",
          "type": "bytes32"
        }
      ],
      "name": "isTeamNameAvailable",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "vanityString",
          "type": "string"
        }
      ],
      "name": "isValidTeamName",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
    }
  ]
}