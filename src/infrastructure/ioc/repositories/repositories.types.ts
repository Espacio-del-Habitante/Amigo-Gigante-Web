const REPOSITORY_TYPES = {
  DebugRepository: Symbol.for("DebugRepository"),
  AnimalRepository: Symbol.for("AnimalRepository"),
  AdoptionRequestRepository: Symbol.for("AdoptionRequestRepository"),
  EventRepository: Symbol.for("EventRepository"),
  ProductRepository: Symbol.for("ProductRepository"),
  AuthRepository: Symbol.for("AuthRepository"),
  FoundationRepository: Symbol.for("FoundationRepository"),
  FoundationProfileRepository: Symbol.for("FoundationProfileRepository"),
  FoundationMembershipRepository: Symbol.for("FoundationMembershipRepository"),
};

export { REPOSITORY_TYPES };
