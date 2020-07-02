import React, { useState, useEffect } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import { Header, RepositoryInfo, Issues } from './styles';

interface RepositoryParams{
  repository: string;
}

interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  }
}

interface Issue {
  title: string;
  id: number;
  html_url: string;
  user: {
    login: string;
  }
}

const Repository: React.FC = () => {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  const { params } = useRouteMatch<RepositoryParams>();

  useEffect(() => {

    api.get(`repos/${params.repository}`).then(response => {
      setRepository(response.data);
    });

    api.get(`repos/${params.repository}/issues`).then(response => {
      setIssues(response.data);
    });


    /* async function loadData(): Promise<void> {
      const [repository, issues] = await Promise.all([
        api.get(`repos/${params.repository}`),
        api.get(`repos/${params.repository}/issues`)
      ]);
    }

    loadData(); 
    
    Este bloco possui o mesmo funcionamento que o get().then(),
    porém adaptado de uma forma que possa ser utilizado dentro de um useEffect,
    já que por padrão o useEffect não aceita ser assíncrono.
    O método Promise.all() faz com que as duas requisições sejam executadas ao mesmo tempo.
    Sem isso, a segunda requisição só executaria quando a primeira fosse completada.
    */


  }, [params.repository]);

  return (
    <>
    <Header>
      <img src={logoImg} alt="GitHub Explorer"/>
      <Link to="/">
        <FiChevronLeft size={16}/>
        
        Voltar
      </Link>
    </Header>

    {repository &&(
      <RepositoryInfo>
      <header>
        <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
        <div>
          <strong>{repository.full_name}</strong>
          <p>{repository.description}</p>
        </div>
      </header>
      <ul>
        <li>
          <strong>{repository.stargazers_count}</strong>
          <span>Stars</span>
        </li>
        <li>
          <strong>{repository.forks_count}</strong>
          <span>Forks</span>
        </li>
        <li>
          <strong>{repository.open_issues_count}</strong>
          <span>Issues abertas</span>
        </li>
      </ul>
    </RepositoryInfo>
    )}

    <Issues>
      {issues.map(issue => (
        <a target="blank" key={issue.id} href={issue.html_url}>
          <div>
            <strong>{issue.title}</strong>
            <p>{issue.user.login}</p>
          </div>
          <FiChevronRight  size={20}/>
        </a>
      ))}
    </Issues>
    </>
  );
}

export default Repository;
