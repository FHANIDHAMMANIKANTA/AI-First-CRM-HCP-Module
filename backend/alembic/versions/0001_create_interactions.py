"""create interactions table

Revision ID: 0001_create_interactions
Revises: 
Create Date: 2026-05-05 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = '0001_create_interactions'
down_revision = None
branch_labels = None
depend_on = None


def upgrade():
    op.create_table(
        'interactions',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('hcp_name', sa.String(length=255), nullable=False),
        sa.Column('interaction_type', sa.String(length=50), nullable=False),
        sa.Column('date', sa.String(length=50), nullable=False),
        sa.Column('time', sa.String(length=50), nullable=False),
        sa.Column('attendees', sa.Text(), nullable=True),
        sa.Column('topics', sa.Text(), nullable=True),
        sa.Column('materials_shared', sa.Text(), nullable=True),
        sa.Column('samples_distributed', sa.Text(), nullable=True),
        sa.Column('sentiment', sa.String(length=20), nullable=True),
        sa.Column('outcomes', sa.Text(), nullable=True),
        sa.Column('follow_up_actions', sa.Text(), nullable=True),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
    )


def downgrade():
    op.drop_table('interactions')
