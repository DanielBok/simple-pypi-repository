"""package tables

Revision ID: 7c7fcb828df1
Revises: fab95bf0019a
Create Date: 2020-01-31 21:50:31.419694

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = '7c7fcb828df1'
down_revision = 'fab95bf0019a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('package',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('name', sa.String(length=255), nullable=False),
                    sa.Column('allow_override', sa.Boolean(), nullable=False),
                    sa.Column('private', sa.Boolean(), nullable=False),
                    sa.Column('account_id', sa.Integer(), nullable=False),
                    sa.ForeignKeyConstraint(['account_id'], ['account.id'], ),
                    sa.PrimaryKeyConstraint('id'))
    op.create_index(op.f('ix_package_name'), 'package', ['name'], unique=True)
    op.create_table('package_lock',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('token', sa.String(length=40), nullable=False),
                    sa.Column('description', sa.String(length=255), nullable=True),
                    sa.Column('package_id', sa.Integer(), nullable=True),
                    sa.ForeignKeyConstraint(['package_id'], ['package.id'], ),
                    sa.PrimaryKeyConstraint('id'))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('package_lock')
    op.drop_index(op.f('ix_package_name'), table_name='package')
    op.drop_table('package')
    # ### end Alembic commands ###