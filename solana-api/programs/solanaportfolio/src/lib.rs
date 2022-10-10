use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solanaportfolio {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_visits = 0;
    base_account.total_projects = 0;
    Ok(())
  }

  pub fn add_visit(ctx: Context<AddVisit>) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_visits += 1;
    Ok(())
  }

  pub fn add_project(ctx: Context<AddProject>, title: String, description: String, image_url: String, ) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    let user = &mut ctx.accounts.user;

    let item = ProjectStruct {
      id: base_account.total_projects,
      title: title.to_string(),
      description: description.to_string(),
      image_url: image_url.to_string(),
      user_address: *user.to_account_info().key,
    };
	
    base_account.projects.push(item);
    base_account.total_projects += 1;
    Ok(())
  }
}

#[derive(Accounts)]
pub struct StartStuffOff<'info> {
  #[account(init, payer = user, space = 9000)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
  pub system_program: Program <'info, System>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ProjectStruct {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub image_url: String,
    pub user_address: Pubkey,
}


#[account]
pub struct BaseAccount {
    pub total_projects: u64,
    pub total_visits: u64,
    pub projects: Vec<ProjectStruct>
}

#[derive(Accounts)]
pub struct AddVisit<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
}

#[derive(Accounts)]
pub struct AddProject<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
}

