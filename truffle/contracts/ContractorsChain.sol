pragma solidity >=0.4.21 <0.7.0;

contract ContractorsChain {
    uint256 public userCount = 0;
    uint256 public contractorCount = 0;

    struct Contractor {
        uint256 id;
        string name;
        string phoneNumber;
        string email;
        string licenseNo;
        string addressLines;
        string status;
    }

    struct User {
        uint256 id;
        string name;
        string phoneNumber;
        string email;
    }

    struct UidMap {
        uint256 id;
        string userType;
    }

    mapping(uint256 => Contractor) public contractors;
    mapping(uint256 => User) public users;
    mapping(string => UidMap) public userMap;

    event ContractorCreated(uint256 id, string name);
    event ContractorUpdated(uint256 id, string name, string status);

    constructor() public {
        createContractor(
            "v7aNzmA6fbezsXp7BDPpoyKPRUA2",
            "Sachin",
            "9993332221",
            "something@g.com",
            "X1CCV112N",
            "Trivandrum,Kerala"
        );
    }

    function createContractor(
        string memory _uid,
        string memory _name,
        string memory _phoneNumber,
        string memory _email,
        string memory _licenseNo,
        string memory _addressLines
    ) public {
        contractorCount++;
        contractors[contractorCount] = Contractor(
            contractorCount,
            _name,
            _phoneNumber,
            _email,
            _licenseNo,
            _addressLines,
            "approved"
        );
        userMap[_uid] = UidMap(contractorCount, "contractor");

        emit ContractorCreated(contractorCount, _name);
    }

    function createUser(
        string memory _uid,
        string memory _name,
        string memory _phoneNumber,
        string memory _email
    ) public {
        userCount++;
        users[userCount] = User(userCount, _name, _phoneNumber, _email);
        userMap[_uid] = UidMap(userCount, "user");
    }

    function approve(uint256 _id) public {
        contractors[_id].status = "approved";

        emit ContractorUpdated(
            _id,
            contractors[_id].name,
            contractors[_id].status
        );
    }

    function reject(uint256 _id) public {
        contractors[_id].status = "rejected";

        emit ContractorUpdated(
            _id,
            contractors[_id].name,
            contractors[_id].status
        );
    }
}
