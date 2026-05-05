from sqlalchemy.orm import Session
from app import models, schemas


def create_interaction(db: Session, interaction: schemas.InteractionCreate):
    db_interaction = models.Interaction(**interaction.dict())
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction


def get_interactions(db: Session, skip: int = 0, limit: int = 50):
    return db.query(models.Interaction).offset(skip).limit(limit).all()


def get_interaction(db: Session, interaction_id: int):
    return db.query(models.Interaction).filter(models.Interaction.id == interaction_id).first()


def update_interaction(db: Session, interaction_id: int, changes: schemas.InteractionUpdate):
    db_interaction = get_interaction(db, interaction_id)
    if not db_interaction:
        return None
    for field, value in changes.dict(exclude_unset=True).items():
        setattr(db_interaction, field, value)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction
