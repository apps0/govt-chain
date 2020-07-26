pragma solidity >=0.4.21 <0.7.0;

contract GovtsChain {
    uint256 public projectsCount = 0;
    uint256 public quotationsCount = 0;

    struct Project {
        uint256 id;
        string name;
        string description;
        string fund;
        string status;
        uint256 quotationId;
        uint256 quotationsCount;
    }

    struct Quotation {
        uint256 id;
        uint256 projectId;
        string projectName;
        string status;
    }

    mapping(uint256 => Project) public projects;
    mapping(uint256 => Quotation) public quotations;

    event ProjectCreated(uint256 id, string name, string description);
    event QuotationCreated(uint256 id, uint256 projectId, string projectName);

    constructor() public {
        createProject("Project name", "Initial test project", "Fund 1");
    }

    function createProject(
        string memory _name,
        string memory _description,
        string memory _fund
    ) public {
        projectsCount++;
        projects[projectsCount] = Project(
            projectsCount,
            _name,
            _description,
            _fund,
            "new",
            0,
            0
        );

        emit ProjectCreated(projectsCount, _name, _description);
    }

    function createQuotation(uint256 _projectId, string memory _projectName)
        public
    {
        quotationsCount++;
        quotations[quotationsCount] = Quotation(
            quotationsCount,
            _projectId,
            _projectName,
            "new"
        );

        emit QuotationCreated(quotationsCount, _projectId, _projectName);
    }
}
